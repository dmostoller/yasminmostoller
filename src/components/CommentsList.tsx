// CommentsList.tsx
import { Trash2 } from 'lucide-react';
import { User } from '@/lib/types';
import { useComments } from '@/hooks/useComments';

interface CommentsListProps {
  user: User | null | undefined;
  painting_id: number;
}

const CommentsList: React.FC<CommentsListProps> = ({ user, painting_id }) => {
  const { comments, isLoading, error, deleteComment } = useComments();

  const filteredComments = comments.filter(comment => comment.painting_id === painting_id);

  const handleDeleteComment = async (commentId: number) => {
    deleteComment(commentId);
  };

  if (isLoading) return <div className="text-center p-4">Loading comments...</div>;
  if (error)
    return <div className="text-center text-red-500 p-4">Error: {(error as Error).message}</div>;

  return (
    <div className="w-full max-w-screen-2xl mx-auto">
      {/* Kanban-style Comments Grid */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-6">Comments ({filteredComments.length})</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max">
          {filteredComments.map(comment => (
            <div
              key={comment.id}
              className="bg-[var(--background-secondary)] rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-[var(--card-border)] hover:translate-y-[-2px]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 via-blue-500 to-teal-400 flex items-center justify-center text-white font-medium text-sm">
                    {comment.users?.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-medium text-[var(--text-primary)] text-sm">
                      {comment.users?.username}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {comment.date_added
                        ? new Date(comment.date_added).toLocaleDateString()
                        : 'No date'}
                    </p>
                  </div>
                </div>
                {user && user.id === comment.user_id && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-[var(--text-secondary)] hover:text-red-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                {comment.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentsList;
