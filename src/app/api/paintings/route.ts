// app/api/paintings/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const paintings = await prisma.paintings.findMany({
      select: {
        id: true,
        title: true,
        materials: true,
        width: true,
        height: true,
        sale_price: true,
        image: true,
        sold: true,
      },
      orderBy: {
        id: 'desc',
      },
    });

    // Transform the data to match our frontend expectations
    const formattedPaintings = paintings.map((painting) => ({
      id: painting.id.toString(),
      title: painting.title,
      materials: painting.materials || '',
      width: painting.width || 0,
      height: painting.height || 0,
      sale_price: painting.sale_price || 0,
      image: painting.image || '',
      sold: painting.sold || false,
    }));

    return NextResponse.json(formattedPaintings, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch paintings from database' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
