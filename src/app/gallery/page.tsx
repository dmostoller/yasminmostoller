'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { DollarSign } from 'lucide-react';
import { Navigation } from 'swiper/modules';
import { usePaintings } from '@/hooks/usePaintings';
import { Painting } from '@/lib/types';
import LoadingSpinner from '@/components/LoadingSpinner';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const Gallery: React.FC = () => {
  const { data: paintings, isLoading, error } = usePaintings();

  const shuffledPaintings = useMemo(() => {
    return paintings ? shuffleArray(paintings) : [];
  }, [paintings]);

  if (isLoading) {
    return (
      <div className="container mx-auto mt-6 min-h-screen max-w-3xl px-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[90vh]">
        <p className="text-xl text-red-600">Error loading gallery: {error.message}</p>
      </div>
    );
  }

  if (!paintings || paintings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[90vh]">
        <p className="text-xl">No paintings available</p>
      </div>
    );
  }

  const gallery = shuffledPaintings.map((painting: Painting) => (
    <SwiperSlide key={painting.id}>
      <div className="relative w-full aspect-square">
        <Image
          fill
          className="object-contain"
          alt={painting.title}
          src={painting.image || ''}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 1200px"
          unoptimized
        />
      </div>
      <div className="py-4 md:py-6 px-3 md:px-4 space-y-2">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold">{painting.title}</h1>
        <p className="text-base md:text-lg text-gray-600">{painting.materials}</p>
        <p className="text-base md:text-lg text-gray-600">
          {painting.width}&quot; x {painting.height}&quot;
        </p>
        <div className="flex items-center gap-2">
          {painting.sold ? (
            <span className="text-red-500 font-medium">SOLD</span>
          ) : (
            <Link href="/contact" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
              <DollarSign className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-base md:text-lg">{painting.sale_price}</span>
            </Link>
          )}
        </div>
      </div>
    </SwiperSlide>
  ));

  return (
    <main className="container mx-auto mt-6 min-h-screen max-w-3xl px-4">
      <div className="h-[900px] w-full max-w-[1200px] mx-auto">
        <Swiper
          loop={true}
          autoHeight={true}
          spaceBetween={100}
          navigation={true}
          modules={[Navigation]}
          className="mb-2"
        >
          {gallery}
        </Swiper>
      </div>
    </main>
  );
};

export default Gallery;
