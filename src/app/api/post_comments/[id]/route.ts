import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = parseInt(url.pathname.split('/').pop() || '');

    if (!id || isNaN(id)) {
      return NextResponse.json({ error: 'Invalid comment ID' }, { status: 400 });
    }

    const deletedComment = await prisma.post_comments.delete({
      where: { id },
    });

    if (!deletedComment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json(deletedComment, { status: 200 });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
