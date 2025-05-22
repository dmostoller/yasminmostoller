// app/api/instagram/diagnose/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  const diagnosis = {
    timestamp: new Date().toISOString(),
    environmentVariables: {
      INSTAGRAM_APP_ID: !!process.env.INSTAGRAM_APP_ID,
      INSTAGRAM_APP_SECRET: !!process.env.INSTAGRAM_APP_SECRET,
      INSTAGRAM_ACCESS_TOKEN: !!process.env.INSTAGRAM_ACCESS_TOKEN,
    },
    tokenStatus: null as any,
    refreshStatus: null as any,
    recommendations: [] as string[],
  };

  // Check environment variables
  const missingVars = [];
  if (!process.env.INSTAGRAM_APP_ID) missingVars.push('INSTAGRAM_APP_ID');
  if (!process.env.INSTAGRAM_APP_SECRET) missingVars.push('INSTAGRAM_APP_SECRET');
  if (!process.env.INSTAGRAM_ACCESS_TOKEN) missingVars.push('INSTAGRAM_ACCESS_TOKEN');

  if (missingVars.length > 0) {
    diagnosis.recommendations.push(`Missing environment variables: ${missingVars.join(', ')}`);
  }

  // Test current token
  if (process.env.INSTAGRAM_ACCESS_TOKEN) {
    try {
      const response = await axios.get('https://graph.instagram.com/me', {
        params: {
          fields: 'id,username',
          access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
        },
      });
      diagnosis.tokenStatus = {
        valid: true,
        user: response.data,
      };
    } catch (error) {
      const axiosError = error as any;
      diagnosis.tokenStatus = {
        valid: false,
        error: axiosError.response?.data?.error || { message: axiosError.message },
      };
      
      if (axiosError.response?.data?.error?.code === 190) {
        diagnosis.recommendations.push('Token has expired or is invalid');
      }
    }

    // Try to refresh token
    try {
      const refreshResponse = await axios.get('https://graph.instagram.com/refresh_access_token', {
        params: {
          grant_type: 'ig_refresh_token',
          access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
        },
      });
      diagnosis.refreshStatus = {
        success: true,
        expiresIn: refreshResponse.data.expires_in,
        newToken: refreshResponse.data.access_token.substring(0, 20) + '...',
      };
      diagnosis.recommendations.push(
        'Token refresh successful! Update INSTAGRAM_ACCESS_TOKEN in your .env file with the new token shown above'
      );
    } catch (error) {
      const axiosError = error as any;
      diagnosis.refreshStatus = {
        success: false,
        error: axiosError.response?.data?.error || { message: axiosError.message },
      };
      
      if (axiosError.response?.data?.error?.code === 190) {
        diagnosis.recommendations.push(
          'Token cannot be refreshed (expired for too long or invalid)',
          'You need to re-authenticate through Instagram OAuth flow',
          'Visit /api/auth/signin and sign in with Instagram'
        );
      }
    }
  } else {
    diagnosis.recommendations.push(
      'Add INSTAGRAM_ACCESS_TOKEN to your .env file',
      'Authenticate through Instagram OAuth to get a new token'
    );
  }

  diagnosis.recommendations.push(
    'Make sure your Instagram app is still active in Meta Developer Console',
    'Ensure your app has the necessary permissions: instagram_content_publish'
  );

  return NextResponse.json(diagnosis, { status: 200 });
}