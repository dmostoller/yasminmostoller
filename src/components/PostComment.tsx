// PostComment.tsx
import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { User, PostComment as PostCommentType } from '@/lib/types';

interface PostCommentProps {
  username: string;
  comment?: string;
  id: number;
  date_added?: string;
  comment_user_id: number;
  user: User | null;
  onDeleteComment: (id: number) => void;
}

const PostComment: React.FC<PostCommentProps> = ({
  username,
  comment,
  id,
  date_added,
  comment_user_id,
  user,
  onDeleteComment,
}) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDeleteComment = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/post_comments/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDeleteComment(id);
      } else {
        throw new Error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mb-4 rounded-lg bg-[var(--background-secondary)] p-4 shadow border border-[var(--text-secondary)]">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-[var(--text-primary)]">{username}</span>
            <span className="text-sm text-[var(--text-secondary)]">{date_added}</span>
          </div>
          {user && user.id === comment_user_id && (
            <button
              onClick={handleDeleteComment}
              disabled={isDeleting}
              className="rounded-full p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--background-primary)] hover:text-red-500 disabled:opacity-50"
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

export default PostComment;
