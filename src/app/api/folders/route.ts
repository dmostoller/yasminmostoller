import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const folders = await prisma.folders.findMany({
      include: {
        paintings: true, // Include related paintings if needed
      },
    });

    return NextResponse.json(folders, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch folders:', error);
    return NextResponse.json({ error: 'Failed to fetch folders' }, { status: 500 });
  }
}
