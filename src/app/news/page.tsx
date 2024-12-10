'use client';

import { Plus } from 'lucide-react';
import Post from '@/components/Post';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useSession } from 'next-auth/react';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { usePosts } from '@/hooks/usePosts';

const NewsPage = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.is_admin;
  const { data: posts, isLoading, error } = usePosts();

  const sortedPosts =
    posts?.sort((a, b) => (a.date_added && b.date_added && a.date_added > b.date_added ? -1 : 1)) ?? [];

  const blog = sortedPosts.map((post) => (
    <Post
      key={post.id}
      id={post.id}
      title={post.title}
      content={post.content}
      image_url={post.image_url}
      video_url={post.video_url}
      date_added={post.date_added}
      isAdmin={isAdmin}
    />
  ));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error</p>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 mt-12">
      {session?.user && isAdmin && (
        <div className="max-w-7xl mx-auto flex justify-center">
          <PrimaryButton
            href="/news/new"
            icon={Plus}
            hoverText="Create New Post"
            className="w-60 rounded-full"
            showTextOnHover
          >
            <span className="block group-hover:hidden">
              <Plus className="h-6 w-6" />
            </span>
            <span className="hidden group-hover:block">Create New Post</span>
          </PrimaryButton>
        </div>
      )}

      <div className="mt-6">
        <div className="grid grid-cols-1 gap-6 justify-items-center">{blog}</div>
      </div>
    </div>
  );
};

export default NewsPage;
