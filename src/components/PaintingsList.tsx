'use client';

import React from 'react';
import Painting from '@/components/Painting';
import { Painting as PaintingType } from '@/lib/types';

interface PaintingsListProps {
  paintings: PaintingType[];
  lastElementRef?: (node: HTMLElement | null) => void;
}

function PaintingsList({ paintings, lastElementRef }: PaintingsListProps) {
  return (
    <div className="max-w-full mx-auto">
      <div className="grid grid-cols-1 gap-6 lg:gap-8 xl:gap-10 2xl:gap-12 md:grid-cols-2 xl:grid-cols-3 mt-6">
        {paintings.map((painting, index) => (
          <div key={painting.id} ref={index === paintings.length - 1 ? lastElementRef : undefined}>
            <Painting
              id={painting.id}
              image={painting.image}
              title={painting.title}
              sale_price={painting.sale_price}
              height={painting.height}
              width={painting.width}
              materials={painting.materials}
              sold={painting.sold}
              folder_id={painting.folder_id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PaintingsList;
