// app/api/instagram/fix-token/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    // Step 1: Check current token status
    const currentToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    
    if (!currentToken) {
      return NextResponse.json({
        status: 'error',
        message: 'No Instagram access token found',
        action: 'Please authenticate with Instagram by visiting /api/auth/signin',
      });
    }

    // Step 2: Test current token
    try {
      const testResponse = await axios.get('https://graph.instagram.com/me', {
        params: {
          fields: 'id,username',
          access_token: currentToken,
        },
      });

      // Token is valid, try to refresh it
      try {
        const refreshResponse = await axios.get('https://graph.instagram.com/refresh_access_token', {
          params: {
            grant_type: 'ig_refresh_token',
            access_token: currentToken,
          },
        });

        return NextResponse.json({
          status: 'success',
          message: 'Token refreshed successfully',
          newToken: refreshResponse.data.access_token,
          expiresIn: refreshResponse.data.expires_in,
          user: testResponse.data,
          action: 'Update INSTAGRAM_ACCESS_TOKEN in your .env file with the new token',
        });
      } catch (refreshError: any) {
        return NextResponse.json({
          status: 'error',
          message: 'Token is valid but cannot be refreshed',
          error: refreshError.response?.data?.error?.message || refreshError.message,
          user: testResponse.data,
          action: 'Token might be too old. Re-authenticate at /api/auth/signin',
        });
      }
    } catch (testError: any) {
      // Token is invalid
      const errorCode = testError.response?.data?.error?.code;
      const errorMessage = testError.response?.data?.error?.message || testError.message;

      return NextResponse.json({
        status: 'error',
        message: 'Instagram access token is invalid or expired',
        errorCode,
        errorMessage,
        action: 'Please re-authenticate with Instagram by visiting /api/auth/signin',
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error occurred',
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}