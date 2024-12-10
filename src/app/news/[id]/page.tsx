// app/news/[id]/page.tsx
import { notFound } from 'next/navigation';
import PostDetail from '@/components/PostDetail';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const id = Number(resolvedParams.id);

  if (!id) {
    notFound();
  }

  return <PostDetail postId={id} />;
}
