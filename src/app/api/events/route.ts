import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const events = await prisma.events.findMany();
    // console.log('Fetched events:', events); // Debug log
    return NextResponse.json(events);
  } catch (error) {
    console.error('Prisma error:', error); // Debug log
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
