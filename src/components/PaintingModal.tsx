// PaintingModal.tsx
import Image from 'next/image';
import { X } from 'lucide-react';

interface PaintingModalProps {
  imageUrl: string;
  title: string;
  onClose: () => void;
}

export default function PaintingModal({ imageUrl, title, onClose }: PaintingModalProps) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70" onClick={onClose}>
      <div className="relative w-[90vw] h-[90vh] max-w-7xl bg-[var(--background)] border border-[var(--card-border)] rounded-lg shadow-lg m-2.5">
        <button
          onClick={onClose}
          className="absolute right-2 top-2 z-10 p-2 rounded-full bg-[var(--background-secondary)]"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="p-2 h-full">
          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
