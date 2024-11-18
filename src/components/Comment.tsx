// Comment.tsx
import React from 'react';
import { Trash2 } from 'lucide-react';
import { User } from '@/lib/types';

interface CommentProps {
  username: string;
  comment: string;
  id: number;
  date_added: string;
  comment_user_id: number;
  user: User | null;
  onDeleteComment: (id: number) => void;
}

const Comment: React.FC<CommentProps> = ({
  username,
  comment,
  id,
  date_added,
  comment_user_id,
  user,
  onDeleteComment,
}) => {
  const handleDeleteComment = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`/comment/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDeleteComment(id);
      } else {
        throw new Error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="mb-4">
      <div className="rounded-lg bg-white p-4 shadow">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">{username}</span>
              <span className="text-sm text-gray-500">{date_added}</span>
            </div>
          </div>
          <p className="text-gray-700">{comment}</p>
          {user && user.id === comment_user_id && (
            <div className="flex justify-end">
              <button
                onClick={handleDeleteComment}
                className="rounded-full p-2 text-teal-500 hover:bg-teal-50 transition-colors duration-200"
                aria-label="Delete comment"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
