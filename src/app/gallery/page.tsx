'use client';

import React, { useMemo } from 'react';
import { usePaintings } from '@/hooks/usePaintings';
import LoadingSpinner from '@/components/LoadingSpinner';
import GalleryCarousel from '@/components/GalleryCarousel';
import { Painting } from '@/lib/types';

const Gallery: React.FC = () => {
  const { data: paintings, isLoading, error } = usePaintings();

  // Transform paintings to match GalleryCarousel interface
  const artPieces = useMemo(() => {
    if (!paintings) return [];
    return (paintings as Painting[]).map(painting => {
      const descriptionParts = [];
      if (painting.materials) descriptionParts.push(painting.materials);
      if (painting.width && painting.height) {
        descriptionParts.push(`${painting.width}" × ${painting.height}"`);
      }
      if (painting.price && !painting.sold) descriptionParts.push(painting.price);
      if (painting.sold) descriptionParts.push('SOLD');

      return {
        id: painting.id,
        title: painting.title,
        image: painting.image || '',
        description: descriptionParts.join(' • ') || '',
      };
    });
  }, [paintings]);

  if (isLoading)
    return (
      <div className="container mx-auto mt-6">
        <LoadingSpinner />
      </div>
    );
  if (error) return <div className="text-red-600">Error loading gallery: {error.message}</div>;
  if (!paintings?.length) return <div>No paintings available</div>;

  return (
    <main className="container mx-auto mt-6 min-h-screen max-w-3xl px-4">
      <GalleryCarousel artPieces={artPieces} />
    </main>
  );
};

export default Gallery;
