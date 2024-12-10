'use client';
import { Trash2 } from 'lucide-react';
import { User } from '@/lib/types';
import { useComments } from '@/hooks/useComments';

interface CommentProps {
  username: string;
  comment: string;
  id: number;
  date_added: string;
  comment_user_id: number;
  user: User | null;
}

const Comment: React.FC<CommentProps> = ({
  username,
  comment,
  id,
  date_added,
  comment_user_id,
  user,
}) => {
  const { deleteComment } = useComments();

  const handleDeleteComment = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deleteComment(id);
  };

  return (
    <div className="mb-4 rounded-lg bg-[var(--background-secondary)] p-4 shadow border border-[var(--card-border)] mt-2">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-[var(--text-primary)]">{username}</span>
            <span className="text-sm text-[var(--text-secondary)]">{date_added}</span>
          </div>
          {user && user.id === comment_user_id && (
            <button
              onClick={handleDeleteComment}
              className="rounded-full p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--background-primary)] hover:text-red-500"
              aria-label="Delete comment"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
        <p className="text-[var(--text-primary)]">{comment}</p>
      </div>
    </div>
  );
};

export default Comment;
