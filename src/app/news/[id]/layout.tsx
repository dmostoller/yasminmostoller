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

  // Base metadata without media
  const metadata: Metadata = {
    title: `${post.title} | Yasmin Mostoller`,
    description: `${post.content.substring(0, 160)}... Read more news and updates from contemporary artist Yasmin Mostoller.`,
    keywords: `${post.title}, Yasmin Mostoller, art news, contemporary art, artist updates`,
    openGraph: {
      title: `${post.title} | Yasmin Mostoller`,
      description: `${post.content.substring(0, 160)}...`,
      type: 'article',
      authors: ['Yasmin Mostoller'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | Yasmin Mostoller`,
      description: `${post.content.substring(0, 160)}...`,
      creator: '@YasminMostoller',
    },
    alternates: {
      canonical: `https://yasminmostoller.com/news/${resolvedParams.id}`,
    },
  };

  // Add media-specific metadata
  if (post.video_url) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'video.other',
      videos: [
        {
          url: post.video_url,
          type: 'video/mp4',
        },
      ],
    };
    metadata.twitter = {
      ...metadata.twitter,
    };
  } else if (post.image_url) {
    metadata.openGraph = {
      ...metadata.openGraph,
      images: [
        {
          url: post.image_url,
          width: 1200,
          height: 630,
          alt: post.title,
          type: 'image/jpeg',
        },
      ],
    };
    metadata.twitter = {
      ...metadata.twitter,
      images: [post.image_url],
    };
  }

  return metadata;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
