'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Undo, Edit, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
// import Modal from '@/components/Modal'
// import PostModal from '@/components/PostModal'
import PostCommentsList from '@/components/PostCommentList';
import VideoPlayer from '@/components/VideoPlayer';
import { Post, User } from '@/lib/types';
import LoadingSpinner from '@/components/LoadingSpinner';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function PostDetail({ params }: Props) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  const { data: session } = useSession();
  //   const isAdmin = session?.user?.role === 'admin';
  const isAdmin = true;
  const [post, setPost] = useState<Post>({} as Post);
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function handleOpen() {
    setModalOpen(true);
  }

  function handleClose() {
    setModalOpen(false);
  }

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      setError(null);
      fetch(`/api/posts/${id}`)
        .then(async (res) => {
          if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to fetch post');
          }
          return res.json();
        })
        .then((data) => {
          setPost(data);
          setVideoUrl(data.video_url);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id]);

  const handleDeletePost = async (e: React.MouseEvent) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });
      router.push('/');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen px-4 mt-12">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-lg bg-white shadow-md">
        <div className="md:flex">
          {/* Left column - Media */}
          <div className="md:w-3/4">
            {post.image_url !== 'undefined' && post.image_url !== null && post.image_url !== 'null' && (
              <div>
                <img
                  src={post.image_url}
                  onClick={handleOpen}
                  alt={post.title}
                  className="w-full cursor-pointer object-cover"
                />
              </div>
            )}
            {videoUrl !== 'undefined' &&
              videoUrl !== null &&
              videoUrl !== 'null' &&
              videoUrl !== undefined && (
                <div>
                  <VideoPlayer videoUrl={videoUrl} />
                </div>
              )}
          </div>

          {/* Right column - Content */}
          <div className="p-6 md:w-1/2">
            <h2 className="mb-2 text-2xl font-bold">{post.title}</h2>
            <div className="mb-4 text-sm text-gray-600">
              <span>{post.date_added}</span>
            </div>
            <div className="mb-6">
              <p className="text-gray-700">{post.content}</p>
            </div>
            <div className="flex gap-2 pt-4">
              <Link href="/news" className="rounded-full bg-teal-50 p-2 text-teal-600 hover:bg-teal-100">
                <Undo className="h-5 w-5" />
              </Link>
              {session?.user && isAdmin && (
                <>
                  <Link
                    href={`/posts/${id}/edit`}
                    className="rounded-full bg-teal-600 p-2 text-white hover:bg-teal-700"
                  >
                    <Edit className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={handleDeletePost}
                    className="rounded-full bg-teal-600 p-2 text-white hover:bg-teal-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
        <PostCommentsList
          user={
            session?.user
              ? {
                  id: session.user.id,
                  username: session.user.name,
                  email: session.user.email,
                  image: session.user.image,
                  password_hash: '',
                }
              : null
          }
          post_id={post.id}
        />
      </div>
    </div>
  );
}
