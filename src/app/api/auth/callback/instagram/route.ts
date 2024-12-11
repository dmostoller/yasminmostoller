// app/api/auth/callback/instagram/route.ts
import { NextResponse } from 'next/server';
import { InstagramAuth } from '../../instagram/utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    const token = await InstagramAuth.exchangeCodeForToken(code);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/api/auth/callback/instagram?access_token=${token}`
    );
  } catch (error) {
    console.error('Instagram callback error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
