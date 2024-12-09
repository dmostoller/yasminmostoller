'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { DollarSign } from 'lucide-react';
import type { Swiper as SwiperType } from 'swiper';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { usePaintings } from '@/hooks/usePaintings';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { Painting } from '@/lib/types';
import LoadingSpinner from '@/components/LoadingSpinner';

const Gallery: React.FC = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const { data: paintings, isLoading, error } = usePaintings();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[90vh]">
        <p className="text-xl text-red-600">Error loading gallery: {error.message}</p>
      </div>
    );
  }

  if (!paintings) return null;

  const gallery = paintings.map((painting: Painting) => (
    <SwiperSlide key={painting.id}>
      <div className="relative w-full aspect-square">
        <Image
          fill
          className="object-contain"
          alt={painting.title}
          src={painting.image || ''}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 1200px"
          unoptimized // Add this if image URLs are from external source
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

  const thumbGallery = paintings.map((painting: Painting) => (
    <SwiperSlide key={painting.id}>
      <div className="relative w-full aspect-square">
        <Image
          fill
          className="object-cover rounded cursor-pointer"
          alt={painting.title}
          src={painting.image || ''}
          sizes="(max-width: 300px) 100vw, 300px"
          unoptimized // Add this if image URLs are from external source
        />
      </div>
    </SwiperSlide>
  ));

  return (
    <main className="container mx-auto mt-12 min-h-screen max-w-7xl px-4">
      <div className="h-[900px] w-full max-w-[1200px] mx-auto">
        <Swiper
          loop={true}
          autoHeight={true}
          spaceBetween={100}
          navigation={true}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mb-4"
        >
          {gallery}
        </Swiper>

        <Swiper
          onSwiper={setThumbsSwiper}
          loop={true}
          spaceBetween={10}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="thumb-swiper"
        >
          {thumbGallery}
        </Swiper>
      </div>
    </main>
  );
};

export default Gallery;
