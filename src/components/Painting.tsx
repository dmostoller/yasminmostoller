// Painting.tsx
'use client';

import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import type { Painting as PaintingType } from '@/lib/types';

export default function Painting(props: PaintingType) {
  const { image, title, sold, width, height, materials, sale_price, id } = props;
  return (
    <Link
      href={`/paintings/${id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-[var(--card-border)] bg-[var(--background-secondary)] shadow-sm transition-all duration-200 hover:shadow-lg"
    >
      <div className="relative aspect-square w-full overflow-hidden">
        {image && (
          <CldImage
            width="960"
            height="600"
            src={image || ''}
            alt={title || 'Post image'}
            sizes="100vw"
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
        )}
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
            <span className="text-blue-600 hover:text-blue-800">${sale_price}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
