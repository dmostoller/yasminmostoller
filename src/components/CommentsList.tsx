// CommentsList.tsx
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { Comment as CommentType, User } from '@/lib/types';

interface CommentsListProps {
  user: User | null;
  painting_id: number;
}

const CommentsList: React.FC<CommentsListProps> = ({ user, painting_id }) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isComFormVis, setIsComFormVis] = useState<boolean>(false);

  const changeIsComFormVis = () => {
    setIsComFormVis(!isComFormVis);
  };

  useEffect(() => {
    fetch(`/comment`)
      .then((res) => res.json())
      .then((comments: CommentType[]) => setComments(comments));
  }, []);

  const deleteComment = (deleted_comment_id: number) => {
    setComments((comments) => comments.filter((comment) => comment.id !== deleted_comment_id));
  };

  const commentsSection = comments
    .filter((comment) => comment.painting_id === painting_id)
    .map((comment) => (
      <Comment
        key={comment.id}
        id={comment.id}
        username={comment.users?.username || ''}
        comment={comment.comment || ''}
        date_added={comment.date_added || ''}
        comment_user_id={comment.user_id || 0}
        user={user}
        onDeleteComment={deleteComment}
      />
    ));

  const addComment = (newComment: CommentType) => {
    setComments([...comments, newComment]);
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl">
      <h3 className="text-right text-xl font-semibold border-b pb-2 pt-4 mb-4">Comments</h3>
      {commentsSection}
      {user ? (
        <div className="pb-6 pt-3">
          {isComFormVis ? (
            <CommentForm
              user={user}
              onAddComment={addComment}
              paintingId={painting_id}
              onChangeIsComFormVis={changeIsComFormVis}
            />
          ) : (
            <button
              onClick={changeIsComFormVis}
              className="w-full px-4 py-2 rounded-full border border-teal-500 text-teal-500 hover:bg-teal-50 transition-colors duration-200 flex items-center justify-center group"
              tabIndex={0}
            >
              <span className="block group-hover:hidden">
                <Plus className="w-5 h-5" />
              </span>
              <span className="hidden group-hover:block">New Comment</span>
            </button>
          )}
        </div>
      ) : (
        <div className="flex justify-center p-4">
          <div className="bg-blue-50 border border-blue-100 rounded p-3 text-sm">
            Please{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>{' '}
            or{' '}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Create an Account
            </Link>{' '}
            to leave a comment
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsList;
