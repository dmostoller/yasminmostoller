'use client';

import React, { useState } from 'react';
import { CldImage } from 'next-cloudinary';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation, Virtual, Thumbs, EffectFade } from 'swiper/modules';
import { Painting } from '@/lib/types';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/virtual';
import 'swiper/css/thumbs';
import 'swiper/css/effect-fade';

const PRELOAD_COUNT = 5;
const VISIBLE_THUMBS = 6;

interface GallerySwiperProps {
  paintings: Painting[];
}

const GallerySwiper: React.FC<GallerySwiperProps> = ({ paintings }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [visibleThumbIndexes, setVisibleThumbIndexes] = useState<number[]>([]);

  const handleThumbsProgress = (swiper: SwiperType) => {
    const visibleSlides = swiper.slides
      .filter((_, idx) => {
        const slideEl = swiper.slides[idx];
        return slideEl && slideEl.classList.contains('swiper-slide-visible');
      })
      .map(slide => {
        const index = slide.getAttribute('data-swiper-slide-index');
        return index ? parseInt(index) : swiper.realIndex;
      });

    setVisibleThumbIndexes(prev => {
      const combined = [...new Set([...prev, ...visibleSlides])];
      return combined.sort((a, b) => a - b);
    });
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);

    const currentIndex = swiper.activeIndex;
    const preloadIndexes = Array.from(
      { length: PRELOAD_COUNT * 2 + 1 },
      (_, i) => currentIndex - PRELOAD_COUNT + i
    ).filter(i => i >= 0 && i < paintings.length);

    setVisibleThumbIndexes(prev => [...new Set([...prev, ...preloadIndexes])]);
  };

  return (
    <div className="h-[900px] w-full max-w-[1200px] mx-auto">
      <Swiper
        modules={[Navigation, Virtual, Thumbs, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        virtual={{
          enabled: true,
          addSlidesAfter: PRELOAD_COUNT,
          addSlidesBefore: PRELOAD_COUNT,
          cache: false,
        }}
        watchSlidesProgress={true}
        thumbs={{ swiper: thumbsSwiper }}
        onSlideChange={handleSlideChange}
        navigation={true}
        spaceBetween={0}
        className="mb-2 h-[700px]"
      >
        {paintings.map((painting, index) => (
          <SwiperSlide key={painting.id} virtualIndex={index} className="swiper-lazy">
            <div className="relative w-full aspect-square">
              <CldImage
                fill
                className="object-contain"
                alt={painting.title}
                src={painting.image ?? ''}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 1200px"
                loading={
                  index === activeIndex || visibleThumbIndexes.includes(index) ? 'eager' : 'lazy'
                }
                priority={index === activeIndex}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        modules={[Thumbs, Virtual]}
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={VISIBLE_THUMBS}
        watchSlidesProgress={true}
        virtual={{
          enabled: true,
          addSlidesAfter: 2,
          addSlidesBefore: 2,
        }}
        onProgress={handleThumbsProgress}
        className="thumbs-gallery h-24"
      >
        {paintings.map((painting, index) => (
          <SwiperSlide
            key={`thumb-${painting.id}`}
            virtualIndex={index}
            className={`!w-24 ${index === activeIndex ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="relative w-full h-full cursor-pointer">
              <CldImage
                fill
                className="object-cover rounded"
                alt={painting.title}
                src={painting.image ?? ''}
                sizes="96px"
                loading={visibleThumbIndexes.includes(index) ? 'eager' : 'lazy'}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default GallerySwiper;