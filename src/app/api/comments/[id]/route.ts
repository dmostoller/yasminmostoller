import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = parseInt(url.pathname.split('/').pop() || '');

    if (!id || isNaN(id)) {
      return NextResponse.json({ error: 'Invalid comment ID' }, { status: 400 });
    }

    const comment = await prisma.comments.findUnique({
      where: { id },
    });

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    const deletedComment = await prisma.comments.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        message: 'Comment deleted successfully',
        data: deletedComment || null,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          error: 'Database operation failed',
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to delete comment',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
