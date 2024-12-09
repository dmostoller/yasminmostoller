// components/PostDetail.tsx
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Undo, Edit, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import PostCommentsList from '@/components/PostCommentList';
import VideoPlayer from '@/components/VideoPlayer';
import { Post } from '@/lib/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import FormattedContent from '@/components/FormattedContent';
import DateFormat from '@/components/DateFormat';
import { CldImage } from 'next-cloudinary';
import { CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';
import { PrimaryIconButton } from './buttons/PrimaryIconButton';

interface PostDetailProps {
  post: Post;
}

export default function PostDetail({ post }: PostDetailProps) {
  const { data: session } = useSession();
  const isAdmin = true; // TODO: Replace with actual admin check
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [videoUrl] = useState<string | null>(post.video_url ?? null);

  function handleOpen() {
    setModalOpen(true);
  }

  function handleClose() {
    setModalOpen(false);
  }

  const handleDeletePost = async (e: React.MouseEvent) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
      });
      router.push('/news');
    }
  };

  return (
    <div className="container mx-auto min-h-screen px-4 mt-12">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-lg bg-[var(--background-secondary)] border border-[var(--card-border)] shadow-md">
        <div className="md:flex">
          {/* Left column - Media */}
          <div className="md:w-3/4">
            {post.image_url !== 'undefined' && post.image_url !== null && post.image_url !== 'null' && (
              <div>
                <CldImage
                  width="960"
                  height="600"
                  onClick={handleOpen}
                  src={post.image_url || ''}
                  alt={post.title || 'Post image'}
                  sizes="100vw"
                  className="cursor-pointer"
                />
              </div>
            )}
            {videoUrl !== 'undefined' &&
              videoUrl !== null &&
              videoUrl !== '' &&
              videoUrl !== 'null' &&
              videoUrl !== undefined && (
                <div>
                  <CldVideoPlayer width="1080" height="1920" src={videoUrl} />
                </div>
              )}
          </div>

          {/* Right column - Content */}
          <div className="p-6 md:w-1/2">
            <h2 className="mb-2 text-2xl font-bold text-[var(--text-primary)]">{post.title}</h2>
            <div className="mb-4 text-sm text-[var(--text-secondary)]">
              <DateFormat date={post.date_added} />
            </div>
            <div className="mb-6 text-[var(--text-primary)]">
              <FormattedContent content={post.content || ''} />
            </div>
            <div className="flex gap-2 pt-4">
              <PrimaryIconButton href="/news" icon={Undo} />
              {session?.user && isAdmin && (
                <>
                  <PrimaryIconButton href={`/news/${post.id}/edit`} icon={Edit} />
                  <PrimaryIconButton onClick={handleDeletePost} icon={Trash2} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 rounded-lg bg-[var(--background-secondary)] border border-[var(--card-border)] p-6 shadow-md">
        <PostCommentsList
          user={
            session?.user
              ? {
                  id: session.user.id,
                  username: session.user.name || '',
                  email: session.user.email,
                }
              : null
          }
          post_id={post.id}
        />
      </div>
    </div>
  );
}
