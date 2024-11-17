// PaintingsList.tsx
'use client';

import React from 'react';
import Painting from '@/components/Painting';
import { Painting as PaintingType } from '@/lib/types';

interface PaintingsListProps {
  paintings: PaintingType[];
}

function PaintingsList({ paintings }: PaintingsListProps) {
  const gallery = paintings.map((painting) => {
    return (
      <Painting
        key={painting.id}
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
    );
  });

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{gallery}</div>
    </div>
  );
}

export default PaintingsList;
