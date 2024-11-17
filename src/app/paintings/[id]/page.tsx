// app/paintings/[id]/page.tsx
import { Metadata } from 'next';
import { Painting } from '@/lib/types';
import PaintingDetail from '@/components/PaintingDetail';
import { notFound } from 'next/navigation';

async function getPainting(id: string): Promise<Painting> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    `${
      process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : 'http://localhost:3000'
    }`;

  const res = await fetch(`${baseUrl}/api/paintings/${id}`, {
    next: { revalidate: 60 }
  });

  if (!res.ok) {
    notFound();
  }

  return res.json();
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const painting = await getPainting(resolvedParams.id);

  return {
    title: painting.title,
    description: `View ${painting.title} painting details`
  };
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);

  if (!resolvedParams.id) {
    notFound();
  }

  const painting = await getPainting(resolvedParams.id);

  return <PaintingDetail painting={painting} />;
}
