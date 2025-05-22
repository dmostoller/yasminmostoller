// app/api/instagram/get-fresh-token/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';

export async function POST() {
  try {
    // Check required environment variables
    if (!process.env.INSTAGRAM_APP_ID || !process.env.INSTAGRAM_APP_SECRET) {
      console.error('Missing Instagram credentials in environment');
      return NextResponse.json(
        {
          error: 'Instagram credentials not configured',
          details: 'INSTAGRAM_APP_ID or INSTAGRAM_APP_SECRET is missing',
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    // First try to get token from session (if user recently authenticated)
    const session = (await getServerSession(authOptions)) as Session | null;
    let accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    // If no env token but session has token, use session token
    if (!accessToken && session?.accessToken) {
      console.log('Using token from session instead of environment variable');
      accessToken = session.accessToken;
    }

    if (!accessToken) {
      console.error('No Instagram access token available');
      return NextResponse.json(
        {
          error: 'No Instagram access token',
          details: 'Please authenticate with Instagram at /api/auth/signin',
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    // Try to refresh the token first
    try {
      const response = await axios.get('https://graph.instagram.com/refresh_access_token', {
        params: {
          grant_type: 'ig_refresh_token',
          access_token: accessToken,
        },
      });

      if (!response.data?.access_token) {
        throw new Error('No access token in response');
      }

      console.log('Token refreshed successfully. New token expires in:', response.data.expires_in);
      return NextResponse.json({
        accessToken: response.data.access_token,
        expires_in: response.data.expires_in,
        timestamp: new Date().toISOString(),
      });
    } catch (refreshError) {
      // If refresh fails, but we have a session token, try using it directly
      if (session?.accessToken && accessToken === session.accessToken) {
        console.log('Token refresh failed, but session token might still be valid');
        return NextResponse.json({
          accessToken: session.accessToken,
          expires_in: 5184000, // 60 days default
          timestamp: new Date().toISOString(),
          note: 'Using session token directly as refresh failed',
        });
      }
      // Otherwise, throw the refresh error
      throw refreshError;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorCode = error.response?.data?.error?.code;
      const errorMessage = error.response?.data?.error?.message || error.message;

      console.error('Instagram API error:', {
        code: errorCode,
        message: errorMessage,
        status: error.response?.status,
      });

      // Specific error handling for common issues
      if (errorCode === 190) {
        return NextResponse.json(
          {
            error: 'Instagram token expired',
            details:
              'The access token has expired and cannot be refreshed. Please re-authenticate.',
            action: 'Visit /api/auth/signin to get a new token',
            timestamp: new Date().toISOString(),
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          error: 'Instagram API error',
          details: errorMessage,
          code: errorCode,
          timestamp: new Date().toISOString(),
        },
        { status: error.response?.status || 500 }
      );
    }

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
