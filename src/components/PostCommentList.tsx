// PostCommentList.tsx
import React, { useEffect, useState } from 'react';
import PostComment from './PostComment';
import PostCommentForm from './PostCommentForm';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { PostComment as Comment, User } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface PostCommentsListProps {
  user: User | null;
  post_id: number;
}

export default function PostCommentsList({ user, post_id }: PostCommentsListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isComFormVis, setIsComFormVis] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function changeIsComFormVis() {
    setIsComFormVis(!isComFormVis);
  }

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(`/api/post_comments`);
        if (!res.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await res.json();
        setComments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, []);

  const deleteComment = (deleted_comment_id: number) => {
    setComments((comments) => comments.filter((comment) => comment.id !== deleted_comment_id));
  };

  const commentsSection = comments
    .filter((comment) => comment.post_id === post_id)
    .map((comment) => (
      <PostComment
        key={comment.id}
        id={comment.id}
        username={comment.users?.username || 'Anonymous'}
        comment={comment.comment}
        date_added={comment.date_added}
        comment_user_id={comment.user_id ?? 0}
        user={user}
        onDeleteComment={deleteComment}
      />
    ));

  const addComment = (newComment: Comment) => {
    setComments([...comments, newComment]);
  };

  return (
    <div className="container mx-auto max-w-2xl">
      <h3 className="border-b pb-2 pt-4 text-xl font-semibold">Comments</h3>
      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4 my-4">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}
      {commentsSection}
      {user ? (
        <div className="py-6">
          {isComFormVis ? (
            <PostCommentForm
              user={user}
              onAddComment={addComment}
              postId={post_id}
              onChangeIsComFormVis={changeIsComFormVis}
            />
          ) : (
            <button
              onClick={changeIsComFormVis}
              className="group relative flex h-10 w-full items-center justify-center rounded-full border border-teal-500 text-teal-600 transition-all hover:bg-teal-50"
              tabIndex={0}
            >
              <span className="absolute flex items-center transition-opacity group-hover:opacity-0">
                <Plus className="h-4 w-4" />
              </span>
              <span className="absolute opacity-0 transition-opacity group-hover:opacity-100">
                New Comment
              </span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid place-items-center p-4">
          <div className="rounded-md bg-gray-50 p-4 text-sm">
            <span>
              Please{' '}
              <Link href="/login" className="text-teal-600 hover:underline">
                Login
              </Link>{' '}
              or{' '}
              <Link href="/signup" className="text-teal-600 hover:underline">
                Create an Account
              </Link>{' '}
              to leave a comment
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
