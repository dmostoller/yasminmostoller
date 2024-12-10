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

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const painting = await getPainting(resolvedParams.id);

  return {
    title: `${painting.title} | Original Art by Yasmin Mostoller`,
    description: `${painting.title} (${painting.year}) - ${painting.medium}, ${painting.dimensions}. Original artwork by contemporary artist Yasmin Mostoller. View details, pricing, and availability.`,
    keywords: `${painting.title}, Yasmin Mostoller, original art, contemporary painting, ${painting.medium}, fine art`,
    openGraph: {
      title: `${painting.title} | Original Art by Yasmin Mostoller`,
      description: `${painting.title} (${painting.year}) - ${painting.medium}, ${painting.dimensions}. Original artwork by contemporary artist Yasmin Mostoller.`,
      type: 'website',
      images: [
        {
          url: painting.image || '',
          width: 1200,
          height: 630,
          alt: `${painting.title} - Original artwork by Yasmin Mostoller`,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${painting.title} | Yasmin Mostoller Art`,
      description: `${painting.title} (${painting.year}) - ${painting.medium}, ${painting.dimensions}. Original contemporary artwork.`,
      images: [painting.image || ''],
      creator: '@YasminMostoller',
    },
    alternates: {
      canonical: `https://yasminmostoller.com/paintings/${painting.slug}`,
    },
  };
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
