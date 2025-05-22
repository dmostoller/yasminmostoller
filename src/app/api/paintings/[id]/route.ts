// app/api/paintings/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Painting } from '@/lib/types';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid painting ID' }, { status: 400 });
    }

    const painting = await prisma.paintings.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        materials: true,
        width: true,
        height: true,
        sale_price: true,
        image: true,
        sold: true,
        folder_id: true
      }
    });

    if (!painting) {
      return NextResponse.json({ error: 'Painting not found' }, { status: 404 });
    }

    const formattedPainting: Painting = {
      id: painting.id,
      title: painting.title,
      materials: painting.materials || '',
      width: painting.width || 0,
      height: painting.height || 0,
      sale_price: painting.sale_price || 0,
      image: painting.image || '',
      sold: painting.sold || false,
      folder_id: painting.folder_id || 0
    };

    return NextResponse.json(formattedPainting, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch painting' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Update painting
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = parseInt(resolvedParams.id);
    const body = await request.json();

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid painting ID' }, { status: 400 });
    }

    const updatedPainting = await prisma.paintings.update({
      where: { id },
      data: {
        title: body.title,
        materials: body.materials,
        width: parseInt(body.width),
        height: parseInt(body.height),
        sale_price: parseInt(body.sale_price),
        image: body.image,
        sold: typeof body.sold === 'boolean' ? body.sold : body.sold === 'true',
        folder_id: parseInt(body.folder_id)
      }
    });

    return NextResponse.json(updatedPainting, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update painting' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Delete painting
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid painting ID' }, { status: 400 });
    }

    await prisma.paintings.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Painting deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to delete painting' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
