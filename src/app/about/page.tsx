import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';
import Image from 'next/image';
import { Mail } from 'lucide-react';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';

export const metadata = {
  title: 'Yasmin Mostoller | About Me',
  description: 'Imagination and Emotion',
  openGraph: {
    title: 'Yasmin Mostoller | About Me',
    description: 'Imagination and Emotion',
    url: 'https://yasminmostoller.com/about',
    siteName: 'Yasmin Mostoller',
    images: [
      {
        url: 'https://yasminmostoller.com/images/slider2.jpg',
      },
    ],
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 bg-[var(--background-primary)]">
      <div className="w-full max-w-screen-2xl mx-auto bg-[var(--background-secondary)] rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-full md:w-3/4 aspect-[4/3]">
            <Image
              className="object-cover rounded-lg"
              src="/images/slider2.jpg"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              alt="Yasmin Mostoller at the Jed Williams Gallery"
            />
          </div>
          <div className="p-6 w-full md:w-1/2">
            <div className="text-center md:text-left">
              <h2 className="text-[var(--text-primary)] text-2xl font-bold mb-2">Yasmin Mostoller</h2>
              <div className="text-[var(--text-secondary)] mb-4">
                <span>Philadelphia, PA</span>
              </div>
              <div className="space-y-4 text-[var(--text-secondary)]">
                <p>
                  Persian artist Yasmin Mostoller grew up surrounded by intricate murals, mosaics, and
                  tapestries. Later earning a Bachelor of Arts and a Masters of Fine Arts, Mostoller currently
                  lives and works in Philadelphia, USA.
                </p>
                <p>
                  Yasmin&apos;s large-scale paintings eschew a monolithic approach to abstract painting,
                  instead treating the canvas as a layered three-dimensional landscape, emphasizing movement
                  and connectivity. Bright, colorful, and energetic vistas bend traditional iconography into
                  futuristic hallucinations, imagining invisible planetary forces and hybrid human cultures.
                </p>
                <p>
                  Her work has been shown internationally, with shows in the USA, Iran, France, Spain, India,
                  and Germany.
                </p>
              </div>
              <div className="mt-6 mb-6 flex gap-2 justify-center md:justify-start">
                <Link
                  href="https://www.facebook.com/yasminmostollerart"
                  target="_blank"
                  className="p-3 rounded-full bg-gradient-to-tr from-blue-800 via-blue-500 to-blue-400 hover:from-blue-950 hover:via-blue-600 hover:to-blue-500 text-white transition-all duration-300"
                >
                  <Facebook />
                </Link>
                <PrimaryButton
                  href="/contact"
                  text="Get In Touch"
                  icon={Mail}
                  className="rounded-full font-medium"
                />
                <Link
                  href="https://www.instagram.com/yasminnunsy/"
                  target="_blank"
                  className="p-3 rounded-full bg-gradient-to-tr from-purple-800 via-purple-500 to-purple-400 hover:from-purple-950 hover:via-purple-600 hover:to-purple-500 text-white transition-all duration-300"
                >
                  <Instagram />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
