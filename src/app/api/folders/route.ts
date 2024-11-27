import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as yup from 'yup';

const folderSchema = yup.object().shape({
  name: yup.string().required('Folder name is required')
});

export async function GET() {
  try {
    const folders = await prisma.folders.findMany({
      include: {
        paintings: true
      }
    });

    return NextResponse.json(folders, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch folders:', error);
    return NextResponse.json({ error: 'Failed to fetch folders' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await folderSchema.validate(body);

    const newFolder = await prisma.folders.create({
      data: {
        name: body.name
      }
    });

    return NextResponse.json(newFolder, { status: 201 });
  } catch (error) {
    console.error('Error creating folder:', error);
    if (error instanceof yup.ValidationError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error creating folder' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
