// app/paintings/[id]/PaintingDetail.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CldImage } from 'next-cloudinary';
import Link from 'next/link';
import axios from 'axios';
import { Undo2 } from 'lucide-react';
import fileDownload from 'js-file-download';
import CommentsList from '@/components/CommentsList';
import PaintingModal from '@/components/PaintingModal';
import type { User } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { PrimaryButton } from './buttons/PrimaryButton';
import { Edit, Trash2, Download, MessageSquare } from 'lucide-react';
import { PrimaryIconButton } from './buttons/PrimaryIconButton';
import { SecondaryIconButton } from './buttons/SecondaryIconButton';
import { useDeletePainting, useGetPainting } from '@/hooks/usePaintings';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface PaintingDetailProps {
  paintingId: number;
}
interface Session {
  user: User | null;
}

export default function PaintingDetail({ paintingId }: PaintingDetailProps) {
  const router = useRouter();
  const { data: session }: { data: Session | null } = useSession();
  const isAdmin = session?.user?.is_admin;
  const { data: painting, isLoading, isError } = useGetPainting(paintingId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const deletePainting = useDeletePainting();

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeletePainting = async () => {
    if (window.confirm('Are you sure you want to delete this painting?')) {
      try {
        if (painting) {
          await deletePainting.mutateAsync(painting.id);
        }
        router.push('/paintings');
      } catch (error) {
        console.error('Error deleting painting:', error);
      }
    }
  };

  const handleDownload = (url: string, filename: string) => {
    axios
      .get(url, {
        responseType: 'blob',
      })
      .then(res => {
        fileDownload(res.data, filename);
      })
      .catch(error => {
        console.error('Error downloading file:', error);
      });
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError || !painting) return <ErrorMessage message="Failed to load painting" />;

  return (
    <div className="flex justify-center w-full">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mt-24 rounded-lg shadow-lg bg-[var(--background-secondary)]">
          <div className="flex flex-col md:flex-row">
            <div className="relative w-full md:w-1/2">
              <CldImage
                width="960"
                height="600"
                src={painting.image || ''}
                alt={painting.title || 'Painting image'}
                sizes="100vw"
                className="cursor-pointer"
                onClick={handleImageClick}
                priority
              />
              {isModalOpen && painting.image && (
                <PaintingModal
                  imageUrl={painting.image}
                  title={painting.title}
                  onClose={handleCloseModal}
                />
              )}
            </div>

            <div className="p-6 md:w-1/2">
              <div className="mt-4 space-y-2">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">{painting.title}</h2>
                <p className="text-[var(--text-secondary)]">{painting.materials}</p>
                <p className="text-[var(--text-secondary)]">
                  {painting.width}&quot; x {painting.height}&quot;
                </p>
                <p className="text-[var(--text-primary)]">
                  {painting.sold ? (
                    <span className="font-semibold">SOLD</span>
                  ) : (
                    <Link href="/contact" className="text-teal-500 hover:underline">
                      ${painting.sale_price}
                    </Link>
                  )}
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <SecondaryIconButton href="/paintings" icon={Undo2} />
                {isAdmin && (
                  <>
                    <PrimaryIconButton href={`/paintings/${painting.id}/edit`} icon={Edit} />
                    <PrimaryIconButton onClick={handleDeletePainting} icon={Trash2} />
                  </>
                )}
              </div>
              <div className="mt-16">
                {isAdmin && (
                  <PrimaryButton
                    icon={Download}
                    text="Download"
                    className="rounded-full"
                    onClick={() =>
                      handleDownload(
                        painting.image || '/path/to/default/image.jpg',
                        `${painting.title}.jpg`
                      )
                    }
                  />
                )}
                {!painting.sold && !isAdmin && (
                  <PrimaryButton
                    text="Purchase Inquiry"
                    href="/contact"
                    className="rounded-full"
                    icon={MessageSquare}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition mb-4"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
              />
            </svg>
            {isOpen ? 'Hide Comment Section' : 'Show Comment Section'}
          </button>

          {isOpen && (
            <div className="bg-[var(--background-secondary)] rounded-lg shadow p-4">
              <CommentsList user={session?.user} painting_id={painting.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
