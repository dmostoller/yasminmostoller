'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Post as PostType } from '@/lib/types';
import Post from '@/components/Post';
import LoadingSpinner from '@/components/LoadingSpinner';

interface PostsListProps {
  user: {
    id: number;
    username: string;
  } | null;
  isAdmin: boolean;
}

const NewsPage = ({ user, isAdmin }: PostsListProps) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch('/api/posts');

        if (!res.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const sortedPosts = posts.sort((a, b) =>
    a.date_added && b.date_added && a.date_added > b.date_added ? -1 : 1
  );

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

  return (
    <div className="container mx-auto px-4 mt-12">
      {user && isAdmin && (
        <div className="max-w-7xl mx-auto">
          <Link
            href="/posts/new"
            className="w-full flex items-center justify-center px-4 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors group"
            tabIndex={0}
          >
            <span className="block group-hover:hidden">
              <Plus className="h-5 w-5" />
            </span>
            <span className="hidden group-hover:block">Create New Post</span>
          </Link>
        </div>
      )}

      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">{blog}</div>
      </div>
    </div>
  );
};

export default NewsPage;
