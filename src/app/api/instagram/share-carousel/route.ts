// app/api/instagram/share-carousel/route.ts
import { NextResponse } from 'next/server';
import { InstagramAuth } from '@/app/api/auth/instagram/utils';

interface InstagramAPIErrorResponse {
  error?: {
    message: string;
    code?: number;
  };
  status?: number;
}

interface InstagramError extends Error {
  response?: {
    data?: InstagramAPIErrorResponse;
    status?: number;
  };
}

const DEFAULT_CAROUSEL_IMAGE =
  'https://res.cloudinary.com/ddp2xfpyb/image/upload/v1733873685/carousel-default_ku5b4m.png';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: Request) {
  try {
    // Add request timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

    const { mediaUrls, caption, accessToken } = await request.json();

    console.log('Starting carousel creation:', {
      urlCount: mediaUrls?.length,
      captionLength: caption?.length,
      timestamp: new Date().toISOString(),
    });

    if (!mediaUrls?.length || !accessToken) {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }

    const finalMediaUrls =
      mediaUrls.length === 1 ? [...mediaUrls, DEFAULT_CAROUSEL_IMAGE] : mediaUrls;

    try {
      const containerIds = [];
      for (const url of finalMediaUrls) {
        try {
          const container = await InstagramAuth.createMediaContainer(accessToken, url, 'IMAGE');

          if (!container?.id) {
            throw new Error('Failed to create media container');
          }

          containerIds.push(container.id);
          await delay(1000); // Increase delay to 1s
        } catch (containerError) {
          console.error('Container creation failed:', containerError);
          if (containerError instanceof Error) {
            throw new Error(`Container creation failed: ${containerError.message}`);
          } else {
            throw new Error('Container creation failed: Unknown error');
          }
        }
      }

      console.log('Created containers:', containerIds);

      // Longer delay before carousel creation
      await delay(2000);

      const result = await InstagramAuth.shareCarousel(accessToken, containerIds, caption);

      clearTimeout(timeoutId);

      return NextResponse.json(
        { success: true, result },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      clearTimeout(timeoutId);

      console.error('Instagram API error:', {
        message: (error as Error).message,
        response: (error as InstagramError).response?.data,
        status: (error as InstagramError).response?.status,
        timestamp: new Date().toISOString(),
      });

      // Ensure we always return valid JSON
      return NextResponse.json(
        {
          error: 'Instagram API error',
          details:
            (error as InstagramError).response?.data?.error?.message || (error as Error).message,
          status: (error as InstagramError).response?.status || 500,
        },
        {
          status: (error as InstagramError).response?.status || 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  } catch (error) {
    console.error('Request processing error:', {
      error,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: (error as Error).message,
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
