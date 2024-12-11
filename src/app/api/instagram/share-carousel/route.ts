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
    const { mediaUrls, caption, accessToken } = await request.json();

    console.log('Starting carousel creation:', {
      urlCount: mediaUrls?.length,
      captionLength: caption?.length,
    });

    if (!mediaUrls || !Array.isArray(mediaUrls) || mediaUrls.length === 0) {
      return NextResponse.json({ error: 'Media URLs array is required' }, { status: 400 });
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 });
    }

    let finalMediaUrls = mediaUrls;
    if (mediaUrls.length === 1) {
      finalMediaUrls = [...mediaUrls, DEFAULT_CAROUSEL_IMAGE];
      console.log('Added default carousel image');
    }

    try {
      // Step 1: Create containers with delay between requests
      const containerIds = [];
      for (const url of finalMediaUrls) {
        const container = await InstagramAuth.createMediaContainer(accessToken, url, 'IMAGE');
        containerIds.push(container.id);
        await delay(1000); // 1 second delay between requests
      }

      console.log('Created containers:', containerIds);

      // Step 2: Wait before creating carousel
      await delay(2000);

      // Step 3: Create carousel with container IDs
      const result = await InstagramAuth.shareCarousel(accessToken, containerIds, caption);

      return NextResponse.json({ success: true, result });
    } catch (error: unknown) {
      // Type guard to check if error matches InstagramError structure
      const isInstagramError = (err: unknown): err is InstagramError => {
        return err instanceof Error && 'response' in err;
      };

      console.error('Instagram carousel sharing error:', error);

      if (isInstagramError(error)) {
        console.error('Detailed error:', {
          message: error.message,
          response: error.response?.data,
        });

        return NextResponse.json(
          {
            error: 'Failed to create carousel',
            details: error.response?.data?.error?.message || error.message,
          },
          { status: error.response?.status || 500 }
        );
      }

      // Fallback error response
      return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
    }
  } catch (error) {
    console.error('Request processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
