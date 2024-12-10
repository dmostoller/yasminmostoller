import { Metadata } from 'next';
import { notFound } from 'next/navigation';

async function getPost(id: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    `${
      process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : 'http://localhost:3000'
    }`;

  const res = await fetch(`${baseUrl}/api/posts/${id}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    notFound();
  }

  return res.json();
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.id);

  const metadata: Metadata = {
    title: `${post.title} | Yasmin Mostoller`,
    description: `${post.content.substring(0, 160)}... Read more news and updates from contemporary artist Yasmin Mostoller.`,
    keywords: `${post.title}, Yasmin Mostoller, art news, contemporary art, artist updates`,
    openGraph: {
      title: `${post.title} | Yasmin Mostoller`,
      description: `${post.content.substring(0, 160)}...`,
      type: 'website',
      images: [
        {
          url: post.image_url || '',
          width: 1200,
          height: 630,
          alt: `${post.title} - Yasmin Mostoller`,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | Yasmin Mostoller`,
      description:
        post.content
          .replace(/[#*_`]/g, '') // Remove markdown chars
          .replace(/\n/g, ' ') // Replace newlines with spaces
          .trim()
          .substring(0, 160) + '...',
      creator: '@YasminMostoller',
      images: [post.image_url],
    },
    alternates: {
      canonical: `https://yasminmostoller.com/news/${resolvedParams.id}`,
    },
  };

  return metadata;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
