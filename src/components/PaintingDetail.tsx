'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CldImage } from 'next-cloudinary';
import Link from 'next/link';
import axios from 'axios';
import { Undo2, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import fileDownload from 'js-file-download';
import CommentsList from '@/components/CommentsList';
import PaintingModal from '@/components/PaintingModal';
import type { User } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { useFolders } from '@/hooks/useFolders';
import { useAssignFolder } from '@/hooks/usePaintings';
import { PrimaryButton } from './buttons/PrimaryButton';
import { Edit, Trash2, Download, Facebook } from 'lucide-react';
import { PrimaryIconButton } from './buttons/PrimaryIconButton';
import { SecondaryIconButton } from './buttons/SecondaryIconButton';
import { useDeletePainting, useGetPainting, usePaintings } from '@/hooks/usePaintings';
import ErrorMessage from './ErrorMessage';
import { Bluesky } from './icons/Bluesky';
import { Toaster } from 'react-hot-toast';
import { FacebookShareButton } from 'react-share';
import { StoryShare } from './ShareStory';
import { ShareCarousel } from './ShareCarousel';
import { toast } from 'react-hot-toast';
import { SecondaryButton } from './buttons/SecondaryButton';
import { SecondaryIconButtonFB } from './buttons/SecondaryIconButtonFB';
import { Select } from '@/components/Select';
import CommentForm from './CommentForm';
import LoadingSpinner from './LoadingSpinner';

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
  const { data: allPaintings } = usePaintings();
  const { data: folders } = useFolders();
  const assignFolder = useAssignFolder();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deletePainting = useDeletePainting();
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isContentReady, setIsContentReady] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Calculate previous and next painting IDs (sorted by ID descending - newest to oldest)
  const sortedPaintings = useMemo(
    () => allPaintings?.slice().sort((a, b) => Number(b.id) - Number(a.id)) || [],
    [allPaintings]
  );
  
  // Ensure we're comparing numbers to numbers
  const currentIndex = sortedPaintings.findIndex(p => Number(p.id) === Number(paintingId));
  
  let previousPainting = null;
  let nextPainting = null;
  
  if (currentIndex !== -1) {
    // Previous goes to newer painting (lower index in desc sorted array)
    previousPainting = currentIndex > 0 ? sortedPaintings[currentIndex - 1] : null;
    // Next goes to older painting (higher index in desc sorted array)
    nextPainting = currentIndex < sortedPaintings.length - 1 ? sortedPaintings[currentIndex + 1] : null;
  }

  useEffect(() => {
    if (painting?.folder_id !== undefined) {
      setCurrentFolderId(painting.folder_id);
    }
  }, [painting?.folder_id]);

  // Reset loading states when painting ID changes
  useEffect(() => {
    setImageLoaded(false);
    setIsContentReady(false);
    setIsNavigating(false);
  }, [paintingId]);

  // Set content ready when painting data is loaded
  useEffect(() => {
    if (painting && !isLoading) {
      const timer = setTimeout(() => setIsContentReady(true), 50);
      return () => clearTimeout(timer);
    }
  }, [painting, isLoading]);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleNavigation = (paintingId: number) => {
    if (isNavigating) return;
    setIsNavigating(true);
    router.push(`/paintings/${paintingId}`);
  };

  const handleFolderChange = async (folderId: number) => {
    try {
      setCurrentFolderId(folderId); // Optimistic update
      if (painting) {
        await assignFolder.mutateAsync({
          paintingId: painting.id,
          folderId: folderId,
        });
      }
      toast.success('Folder updated successfully');
    } catch (error) {
      setCurrentFolderId(painting?.folder_id || null); // Revert on error
      console.error('Error assigning folder:', error);
      toast.error('Failed to update folder');
    }
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

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.yasminmostoller.com'}/paintings/${paintingId}`;

  const handleBlueSkyShare = () => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.yasminmostoller.com';
    const shareUrl = `${baseUrl}/paintings/${paintingId}`;
    const text = `Check out "${painting?.title}" by Yasmin Mostoller\n\n${shareUrl}`;

    window.open(
      `https://bsky.app/intent/compose?text=${encodeURIComponent(text)}`,
      'bluesky-share-dialog',
      'width=800,height=600'
    );
  };

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <LoadingSpinner />
    </div>
  );
  if (isError || !painting) return <ErrorMessage message="Failed to load painting" />;

  return (
    <div className="flex justify-center w-full min-h-screen">
      <Toaster position="top-center" />
      <div className="max-w-screen-2xl mx-auto px-4">
        <div
          className={`mt-8 rounded-lg shadow-lg bg-[var(--background-secondary)] transition-opacity duration-500 ${
            isContentReady && imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex flex-col md:flex-row">
            <div className="relative w-full md:w-2/3">
              <CldImage
                width="960"
                height="600"
                src={painting.image || ''}
                alt={painting.title || 'Painting image'}
                sizes="100vw"
                className="cursor-pointer"
                onClick={handleImageClick}
                onLoad={() => setImageLoaded(true)}
                priority
              />
              {isModalOpen && painting.image && (
                <PaintingModal
                  imageUrl={painting.image || ''}
                  title={painting.title}
                  onClose={handleCloseModal}
                />
              )}
            </div>

            <div className="p-6 md:w-1/3">
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

              {/* Navigation buttons */}
              <div className="flex gap-2 mt-4 pb-3 border-b border-[var(--border)]">
                <SecondaryIconButton
                  onClick={
                    previousPainting ? () => handleNavigation(previousPainting.id) : undefined
                  }
                  icon={ChevronLeft}
                  label="Previous"
                  disabled={!previousPainting || isNavigating}
                />
                <SecondaryIconButton
                  href="/paintings"
                  icon={Undo2}
                  label="Back to Gallery"
                  disabled={isNavigating}
                />
                <SecondaryIconButton
                  onClick={nextPainting ? () => handleNavigation(nextPainting.id) : undefined}
                  icon={ChevronRight}
                  label="Next"
                  disabled={!nextPainting || isNavigating}
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mt-3">
                <FacebookShareButton url={shareUrl} hashtag="#art">
                  <SecondaryIconButtonFB icon={Facebook} label="Share on Facebook" />
                </FacebookShareButton>
                <SecondaryIconButton
                  onClick={handleBlueSkyShare}
                  icon={Bluesky}
                  label="Share on BlueSky"
                />
                {!painting.sold && !isAdmin && (
                  // <SecondaryIconButton
                  //   icon={ShoppingCart}
                  //   href="/contact"
                  //   label="Purchase Inquiry"
                  // />
                  <SecondaryIconButton
                    icon={ShoppingCart}
                    href={`/contact?paintingName=${encodeURIComponent(painting.title)}${
                      painting.materials ? `&medium=${encodeURIComponent(painting.materials)}` : ''
                    }${
                      session?.user?.email ? `&email=${encodeURIComponent(session.user.email)}` : ''
                    }${session?.user?.username ? `&name=${encodeURIComponent(session.user.username)}` : ''}`}
                    label="Purchase Inquiry"
                  />
                )}
                {isAdmin && (
                  <>
                    <StoryShare
                      imageUrl={painting.image || ''}
                      caption={`${painting.title} - ${painting.width || ''}" x ${painting.height}" - ${painting.materials || ''}`}
                    />
                    <ShareCarousel
                      imageUrl={painting.image || ''}
                      caption={`${painting.title} - ${painting.width || ''}" x ${painting.height}" - ${painting.materials || ''}`}
                    />
                    <PrimaryIconButton href={`/paintings/${painting.id}/edit`} icon={Edit} />
                    <PrimaryIconButton onClick={handleDeletePainting} icon={Trash2} />
                  </>
                )}
              </div>
              <div className="mt-4">
                {isAdmin && (
                  <>
                    <div className="flex items-center gap-4">
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
                      <div className="flex-1 max-w-52">
                        <Select
                          value={currentFolderId || ''}
                          onChange={e => handleFolderChange(Number(e.target.value))}
                          placeholder="Select a folder"
                          options={
                            folders?.map(folder => ({
                              value: folder.id,
                              label: folder.name,
                            })) || []
                          }
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="mt-4 ">
                {session?.user ? (
                  <div className="pb-6 pt-3 text-center">
                    <CommentForm
                      user={session.user}
                      onAddComment={() => {}}
                      paintingId={painting.id}
                    />
                  </div>
                ) : (
                  <div className="bg-[var(--background-secondary)] rounded-lg p-6 shadow-lg border border-[var(--card-border)] max-w-full md:max-w-xs">
                    <p className="text-center mb-4">Join the conversation</p>
                    <SecondaryButton
                      href="/api/auth/signin"
                      text="Sign In to Comment"
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`mt-8 transition-opacity duration-300 delay-150 ${
            isContentReady ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="bg-[var(--background-secondary)] rounded-lg shadow p-4">
            <CommentsList user={session?.user} painting_id={painting.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
