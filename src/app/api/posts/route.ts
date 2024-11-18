import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Post } from '@/lib/types';

export async function GET() {
  try {
    const posts = await prisma.posts.findMany({
      include: {
        post_comments: {
          include: {
            users: true
          }
        }
      },
      orderBy: {
        date_added: 'desc'
      }
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 });
  }
}
