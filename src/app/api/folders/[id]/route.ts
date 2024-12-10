import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as yup from 'yup';

const folderSchema = yup.object().shape({
  name: yup.string().required('Folder name is required'),
});

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid folder ID' }, { status: 400 });
    }

    const folder = await prisma.folders.findUnique({
      where: { id },
      include: { paintings: true },
    });

    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    return NextResponse.json(folder);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch folder' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid folder ID' }, { status: 400 });
    }

    const body = await request.json();
    await folderSchema.validate(body);

    const existingFolder = await prisma.folders.findUnique({
      where: { id },
    });

    if (!existingFolder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    const updatedFolder = await prisma.folders.update({
      where: { id },
      data: {
        name: body.name,
      },
    });

    return NextResponse.json(updatedFolder);
  } catch (error) {
    console.error('Error updating folder:', error);
    if (error instanceof yup.ValidationError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error updating folder' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid folder ID' }, { status: 400 });
    }

    const existingFolder = await prisma.folders.findUnique({
      where: { id },
    });

    if (!existingFolder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    await prisma.folders.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Folder deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting folder:', error);
    return NextResponse.json({ error: 'Failed to delete folder' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
