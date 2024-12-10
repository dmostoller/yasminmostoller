// app/paintings/[id]/layout.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

async function getPainting(id: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    `${
      process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : 'http://localhost:3000'
    }`;

  const res = await fetch(`${baseUrl}/api/paintings/${id}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    notFound();
  }

  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const painting = await getPainting(resolvedParams.id);

  return {
    title: painting.title,
    description: `View ${painting.title} painting details`,
    openGraph: {
      title: painting.title,
      description: `View ${painting.title} painting details`,
      images: [
        {
          url: painting.image || '',
          width: 1200,
          height: 630,
          alt: painting.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: painting.title,
      description: `View ${painting.title} painting details`,
      images: [painting.image || ''],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
