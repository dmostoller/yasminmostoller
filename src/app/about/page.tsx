import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';

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
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto mt-4 bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Main container - column on mobile, row on desktop */}
        <div className="flex flex-col md:flex-row">
          {/* Image container */}
          <div className="w-full md:w-1/2">
            <img
              className="w-full h-full object-cover"
              src="/images/slider2.jpg"
              alt="Yasmin Mostoller at the Jed William's Gallery"
            />
          </div>
          {/* Content container */}
          <div className="p-6 w-full md:w-1/2">
            <div className="text-center md:text-left">
              <h2 className="text-gray-600 text-2xl font-bold mb-2">Yasmin Mostoller</h2>
              <div className="text-gray-600 mb-4">
                <span>Philadelphia, PA</span>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>
                  Persian artist Yasmin Mostoller grew up surrounded by intricate murals, mosaics, and
                  tapestries. Later earning a Bachelor of Arts and a Masters of Fine Arts, Mostoller currently
                  lives and works in Philadelphia, USA.
                </p>
                <p>
                  Yasmin's large-scale paintings eschew a monolithic approach to abstract painting, instead
                  treating the canvas as a layered three-dimensional landscape, emphasizing movement and
                  connectivity. Bright, colorful, and energetic vistas bend traditional iconography into
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
                  className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <Facebook />
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-full bg-teal-500 text-white hover:bg-teal-600 transition-colors"
                >
                  Get In Touch
                </Link>
                <Link
                  href="https://www.instagram.com/yasminnunsy/"
                  target="_blank"
                  className="p-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors"
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