// app/news/[id]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Post } from '@/lib/types';
import PostDetail from '@/components/PostDetail';

async function getPost(id: number): Promise<Post> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    `${
      process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : 'http://localhost:3000'
    }`;

  const res = await fetch(`${baseUrl}/api/posts/${id}`, {
    next: { revalidate: 60 }
  });

  if (!res.ok) {
    notFound();
  }

  return res.json();
}

interface PageProps {
  params: Promise<{ id: number }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const post = await getPost(resolvedParams.id);

  return {
    title: post.title,
    description: post.content?.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.content?.substring(0, 160),
      images: [
        {
          url: post.image_url || '',
          width: 1200,
          height: 630,
          alt: post.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.content?.substring(0, 160),
      images: [post.image_url || '']
    }
  };
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  if (!resolvedParams.id) {
    notFound();
  }

  const post = await getPost(resolvedParams.id);
  return <PostDetail post={post} />;
}
