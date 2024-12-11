// app/api/instagram/get-fresh-token/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST() {
  try {
    if (!process.env.INSTAGRAM_APP_ID || !process.env.INSTAGRAM_APP_SECRET) {
      throw new Error('Instagram credentials not configured');
    }

    // Get fresh token from Instagram Graph API
    const response = await axios.get('https://graph.instagram.com/refresh_access_token', {
      params: {
        grant_type: 'ig_refresh_token',
        access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
      },
    });

    if (!response.data?.access_token) {
      throw new Error('No access token in response');
    }

    return NextResponse.json({
      accessToken: response.data.access_token,
      expires_in: response.data.expires_in,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get fresh token error:', error);
    return NextResponse.json(
      {
        error: 'Failed to get fresh token',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
