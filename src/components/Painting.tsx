// Painting.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import type { Painting as PaintingType } from '@/lib/types';

export default function Painting(props: PaintingType) {
  const { image, title, sold, width, height, materials, sale_price, id } = props;
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <Link
      href={`/paintings/${id}`}
      className="group block overflow-hidden rounded-lg border border-[var(--card-border)] bg-[var(--background-secondary)] shadow-sm transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        {image && (
          <CldImage
            width="960"
            height="600"
            src={image || ''}
            alt={title || 'Post image'}
            sizes="100vw"
            className={`absolute inset-0 h-full w-full object-cover ${
              imageLoaded ? 'image-loaded' : 'image-loading'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-50 flex items-center justify-center">
          <span className="bg-white text-gray-900 px-6 py-2 rounded-full font-medium opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            View
          </span>
        </div>
      </div>
      <div className="flex flex-col space-y-2 p-4">
        <h3 className="font-semibold text-[var(--text-primary)]">{title}</h3>
        {materials && <p className="text-sm text-[var(--text-secondary)]">{materials}</p>}
        <p className="text-sm text-[var(--text-secondary)]">
          {width}&quot; x {height}&quot;
        </p>
        <div className="text-sm font-medium">
          {sold ? (
            <span className="text-red-600">SOLD</span>
          ) : (
            <span className="text-blue-600">${sale_price}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
