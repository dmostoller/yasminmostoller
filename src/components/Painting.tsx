// Painting.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Painting as PaintingType } from '@/lib/types';

export default function Painting(props: PaintingType) {
  const { image, title, sold, width, height, materials, sale_price, id } = props;
  return (
    <Link
      href={`/paintings/${id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-lg"
    >
      <div className="relative aspect-square w-full overflow-hidden">
        {image && (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
      </div>
      <div className="flex flex-col space-y-2 p-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {materials && <p className="text-sm text-gray-600">{materials}</p>}
        <p className="text-sm text-gray-600">
          {width}" x {height}"
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
