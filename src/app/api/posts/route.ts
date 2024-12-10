// FILE: app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as yup from 'yup';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const postSchema = yup.object().shape({
  title: yup.string().required(),
  content: yup.string().required(),
  image_url: yup.string().nullable(),
  video_url: yup.string().nullable(),
});

const window = new JSDOM('').window;
const purify = DOMPurify(window);

export async function GET() {
  try {
    const posts = await prisma.posts.findMany({
      include: {
        post_comments: {
          include: {
            users: true,
          },
        },
      },
      orderBy: {
        date_added: 'desc',
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    await postSchema.validate(body);

    // Sanitize the HTML content
    const sanitizedContent = purify.sanitize(body.content, {
      ALLOWED_TAGS: [
        'p',
        'br',
        'strong',
        'em',
        'u',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'ul',
        'ol',
        'li',
        'blockquote',
        'a',
        'img',
        'span',
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'style'],
    });

    // Create new post with current timestamp
    const post = await prisma.posts.create({
      data: {
        title: body.title,
        content: sanitizedContent,
        image_url: body.image_url || null,
        video_url: body.video_url || null,
        date_added: new Date().toISOString(),
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    if (error instanceof yup.ValidationError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error creating post' }, { status: 500 });
  }
}
