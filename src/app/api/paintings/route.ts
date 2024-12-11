// app/api/paintings/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Painting } from '@/lib/types';

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
        folder_id: true,
      },
      orderBy: {
        id: 'desc',
      },
    });

    // Transform the data to match our frontend expectations
    const formattedPaintings = paintings.map((painting: Painting) => ({
      id: painting.id.toString(),
      title: painting.title,
      materials: painting.materials || '',
      width: painting.width || 0,
      height: painting.height || 0,
      sale_price: painting.sale_price || 0,
      image: painting.image || '',
      sold: painting.sold || false,
      folder_id: painting.folder_id || null,
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
// Create new painting
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.image) {
      return NextResponse.json({ error: 'Title and image are required' }, { status: 400 });
    }

    const newPainting = await prisma.paintings.create({
      data: {
        title: body.title,
        materials: body.materials || null,
        width: body.width ? parseInt(body.width) : null,
        height: body.height ? parseInt(body.height) : null,
        sale_price: body.sale_price ? parseInt(body.sale_price) : null,
        image: body.image,
        sold: body.sold === 'true',
        folder_id: body.folder_id ? parseInt(body.folder_id) : null,
      },
    });

    return NextResponse.json(newPainting, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create painting' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
