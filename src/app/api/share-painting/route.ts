// app/api/share-painting/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const webhookUrl = process.env.NEXT_PUBLIC_ZAPIER_WEBHOOK_URL;

  try {
    const body = await req.json();

    const response = await fetch(webhookUrl as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.text();

    if (!response.ok) {
      throw new Error(`Zapier webhook failed: ${response.status} ${data}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Zapier webhook error:', error);
    return NextResponse.json({ message: 'Failed to share painting' }, { status: 500 });
  }
}
