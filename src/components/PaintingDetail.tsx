// app/paintings/[id]/PaintingDetail.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import fileDownload from 'js-file-download';
// import CommentsList from '@/components/CommentsList';
// import PaintingModal from '@/components/PaintingModal';
import type { Painting } from '@/lib/types';
import { useSession } from 'next-auth/react';

interface PaintingDetailProps {
  painting: Painting;
}

export default function PaintingDetail({ painting: initialPainting }: PaintingDetailProps) {
  const router = useRouter();
  const { data: session } = useSession();
  //   const isAdmin = session?.user?.role === 'admin';
  const isAdmin = true;
  const [painting] = useState<Painting>(initialPainting);
  const [modalOpen, setModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDeletePainting = async () => {
    if (window.confirm('Are you sure you want to delete this painting?')) {
      try {
        const response = await fetch(`/api/paintings/${painting.id}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete');
        router.push('/paintings');
        router.refresh(); // Refresh the server component
      } catch (error) {
        console.error('Error deleting painting:', error);
      }
    }
  };

  const handleDownload = (url: string, filename: string) => {
    axios
      .get(url, {
        responseType: 'blob'
      })
      .then((res) => {
        fileDownload(res.data, filename);
      })
      .catch((error) => {
        console.error('Error downloading file:', error);
      });
  };

  return (
    <div className="container mx-auto">
      <div className="mt-24 rounded-lg shadow-lg bg-white">
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-1/2">
            <Image
              src={painting.image}
              alt={painting.title}
              width={500}
              height={500}
              className="rounded-lg cursor-pointer"
              onClick={() => setModalOpen(true)}
              priority
            />
            {/* {modalOpen && (
              <PaintingModal 
                painting={painting} 
                onClose={() => setModalOpen(false)} 
              />
            )} */}
          </div>

          <div className="p-6 md:w-1/2">
            <div className="flex justify-end gap-2">
              {isAdmin && (
                <button
                  className="p-2 rounded-full bg-teal-500 text-white hover:bg-teal-600 transition"
                  title="Download Painting"
                  onClick={() => handleDownload(painting.image, `${painting.title}.jpg`)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </button>
              )}
              {!painting.sold && !isAdmin && (
                <Link
                  href="/contact"
                  className="px-4 py-2 text-teal-500 border border-teal-500 rounded-lg hover:bg-teal-50 transition"
                >
                  Purchase Inquiry
                </Link>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <h2 className="text-2xl font-bold">{painting.title}</h2>
              <p className="text-gray-600">{painting.materials}</p>
              <p className="text-gray-600">
                {painting.width}" x {painting.height}"
              </p>
              <p className="text-gray-800">
                {painting.sold ? (
                  <span className="font-semibold">SOLD</span>
                ) : (
                  <Link href="/contact" className="text-teal-500 hover:underline">
                    ${painting.sale_price}
                  </Link>
                )}
              </p>
            </div>

            {isAdmin && (
              <div className="flex gap-2 mt-4">
                <Link
                  href={`/paintings/${painting.id}/edit`}
                  className="p-2 rounded-full bg-teal-500 text-white hover:bg-teal-600 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </Link>
                <button
                  onClick={handleDeletePainting}
                  className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          className="flex items-center gap-2 text-teal-500 hover:text-teal-600 transition"
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
          {isOpen ? 'Hide' : 'Comment'}
        </button>
        {/* 
        {isOpen && (
          <div className="mt-4 bg-white rounded-lg shadow p-4">
            <CommentsList user={session?.user} painting_id={painting.id} />
          </div>
        )} */}
      </div>
    </div>
  );
}
