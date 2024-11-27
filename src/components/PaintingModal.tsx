// PaintingModal.tsx
import Image from 'next/image';
import { type Painting } from '@/lib/types';

interface PaintingModalProps {
  painting: Painting;
}

export default function PaintingModal({ painting }: PaintingModalProps) {
  return (
    <div className="grid place-items-center w-full">
      <div className="w-full bg-gray-900 rounded-lg shadow-lg m-2.5">
        <div className="p-2.5">
          <div>
            <div className="relative w-full aspect-square">
              <Image
                src={painting.image ?? 'https://via.placeholder.com/500x500'}
                alt={painting.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
