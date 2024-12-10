// page.tsx
import { Metadata } from 'next';
import Image from 'next/image';
import { SecondaryButton } from '@/components/buttons/SecondaryButton';

export const metadata: Metadata = {
  title: 'Yasmin Mostoller | Abstract Artist',
  description: 'Imagination and Emotion',
  openGraph: {
    title: 'Yasmin Mostoller | Abstract Artist',
    description: 'Imagination and Emotion',
    url: 'https://yasminmostoller.com/',
    siteName: 'Yasmin Mostoller',
    images: [
      {
        url: 'https://yasminmostoller.com/images/slider2.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yasmin Mostoller | Abstract Artist',
    description: 'Imagination and Emotion',
    images: ['https://yasminmostoller.com/images/slider2.jpg'],
  },
};

export default function Home() {
  return (
    <div className="container mx-auto px-4 min-h-[90vh] bg-[var(--background-primary)]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-24">
        <div className="space-y-6 md:mt-24 ">
          <div className="px-8 py-6 text-[var(--text-secondary)]">
            <h1 className="text-5xl mb-4 text-[var(--text-primary)]">I&apos;m Yasmin,</h1>
            <h1 className="text-2xl">
              I believe in the power of painting to evoke memories and transport us to new realms of
              thought and feeling. Imagination and emotion shape my approach to abstract painting.
            </h1>
            <p className="text-xl mt-6">
              &quot;To draw, you must close your eyes and sing.&quot;
              <br />
              <span className="italic">-Pablo Picasso</span>
            </p>
          </div>
          <div className="flex justify-center">
            <SecondaryButton text="Explore My Paintings" href="/paintings" />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-[var(--background-secondary)]">
            <Image
              src="/images/yasi-header.jpg"
              alt="Yasmin Mostoller"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
