import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = parseInt(resolvedParams.id);
    const { folderId } = await request.json();

    const updatedPainting = await prisma.paintings.update({
      where: { id },
      data: {
        folder_id: folderId,
      },
    });

    return NextResponse.json(updatedPainting, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to assign folder' }, { status: 500 });
  }
}
