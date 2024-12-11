// app/api/instagram/share-story/route.ts
import { NextResponse } from 'next/server';
import { InstagramAuth } from '@/app/api/auth/instagram/utils';

export async function POST(request: Request) {
  try {
    const { mediaUrl, caption, accessToken } = await request.json();

    if (!mediaUrl) {
      return NextResponse.json(
        {
          error: 'Media URL is required',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Pass sticker configuration to the sharing function
    const result = await InstagramAuth.shareToStory(accessToken, mediaUrl, caption || '');

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Story sharing error:', error);
    return NextResponse.json(
      {
        error: 'Failed to share story',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
