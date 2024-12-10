// CommentsList.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { User } from '@/lib/types';
import { SecondaryButton } from './buttons/SecondaryButton';
import { useComments } from '@/hooks/useComments';

interface CommentsListProps {
  user: User | null | undefined;
  painting_id: number;
}

const CommentsList: React.FC<CommentsListProps> = ({ user, painting_id }) => {
  const [isComFormVis, setIsComFormVis] = useState<boolean>(false);
  const { comments, isLoading, error } = useComments();

  const changeIsComFormVis = () => {
    setIsComFormVis(!isComFormVis);
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading comments...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error loading comments: {(error as Error).message}
      </div>
    );
  }

  const commentsSection = comments
    .filter(comment => comment.painting_id === painting_id)
    .map(comment => (
      <Comment
        key={comment.id}
        id={comment.id}
        username={comment.users?.username || ''}
        comment={comment.comment || ''}
        date_added={comment.date_added || ''}
        comment_user_id={comment.user_id || 0}
        user={user ?? null}
      />
    ));

  const handleAddComment = () => {
    setIsComFormVis(false);
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl">
      <h3 className="text-left text-xl font-semibold border-b pb-2 pt-4 mb-4">Comments</h3>
      {commentsSection}
      {user ? (
        <div className="pb-6 pt-3 text-center">
          {isComFormVis ? (
            <CommentForm
              user={user}
              onAddComment={handleAddComment}
              paintingId={painting_id}
              onChangeIsComFormVis={changeIsComFormVis}
            />
          ) : (
            <SecondaryButton
              onClick={changeIsComFormVis}
              className="w-50 rounded-full mt-4"
              icon={Plus}
              text="New Comment"
            />
          )}
        </div>
      ) : (
        <div className="flex justify-center p-4">
          <div className="rounded-md bg-[var(--card-background)] border border-[var(--card-border)] p-4 text-sm">
            <span>
              Please{' '}
              <Link href="/api/auth/signin" className="text-teal-600 hover:underline">
                Sign In
              </Link>{' '}
              to leave a comment
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsList;
