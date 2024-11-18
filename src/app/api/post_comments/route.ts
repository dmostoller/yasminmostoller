// app/api/post_comments/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const comments = await prisma.post_comments.findMany({
      include: {
        users: true,
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const comment = await prisma.post_comments.create({
      data: {
        comment: body.comment,
        date_added: body.date_added,
        post_id: body.post_id,
        user_id: body.user_id,
      },
      include: {
        users: true,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
