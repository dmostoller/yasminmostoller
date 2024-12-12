// CommentsList.tsx
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Plus, Trash2 } from 'lucide-react';
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
  const { comments, isLoading, error, deleteComment } = useComments();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredComments = comments.filter((comment) => comment.painting_id === painting_id);

  const handleDeleteComment = async (commentId: number) => {
    deleteComment(commentId);
  };

  if (isLoading) return <div className="text-center p-4">Loading comments...</div>;
  if (error) return <div className="text-center text-red-500 p-4">Error: {(error as Error).message}</div>;

  // return (
  //   <div className="mt-12 w-full">
  //     <h3 className="text-2xl font-semibold mb-8 text-center">
  //       Join the Conversation ({filteredComments.length})
  //     </h3>

  //     <div className="relative flex gap-8 min-h-[400px]">
  //       {/* Sticky Comment Form */}
  //       <div className="w-[300px] flex-shrink-0">
  //         <div className="sticky top-4">
  //           {user ? (
  //             <div className="bg-[var(--background-secondary)] rounded-lg p-6 shadow-lg border border-[var(--card-border)]">
  //               <CommentForm
  //                 user={user}
  //                 onAddComment={() => {}}
  //                 paintingId={painting_id}
  //                 onChangeIsComFormVis={() => {}}
  //               />
  //             </div>
  //           ) : (
  //             <div className="bg-[var(--background-secondary)] rounded-lg p-6 shadow-lg border border-[var(--card-border)]">
  //               <p className="text-center mb-4">Join the conversation</p>
  //               <Link
  //                 href="/api/auth/signin"
  //                 className="block w-full py-2 px-4 text-center bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
  //               >
  //                 Sign In to Comment
  //               </Link>
  //             </div>
  //           )}
  //         </div>
  //       </div>

  //       {/* Horizontal Scrolling Comments */}
  //       <div ref={scrollContainerRef} className="flex-1 overflow-x-auto pb-6">
  //         <div className="flex gap-6 px-4">
  //           {filteredComments.map((comment) => (
  //             <div
  //               key={comment.id}
  //               className="w-[350px] flex-shrink-0 bg-[var(--background-secondary)] rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-[var(--card-border)] overflow-hidden"
  //             >
  //               <div className="p-6">
  //                 <div className="flex items-center justify-between mb-4">
  //                   <div className="flex items-center gap-3">
  //                     <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-medium">
  //                       {comment.users?.username?.[0]?.toUpperCase()}
  //                     </div>
  //                     <div>
  //                       <h4 className="font-medium text-[var(--text-primary)]">{comment.users?.username}</h4>
  //                       <p className="text-sm text-[var(--text-secondary)]">
  //                         {comment.date_added ? new Date(comment.date_added).toLocaleDateString() : 'No date'}
  //                       </p>
  //                     </div>
  //                   </div>
  //                   {user && user.id === comment.user_id && (
  //                     <button
  //                       // onClick={() => deleteComment(comment.id)}
  //                       className="text-[var(--text-secondary)] hover:text-red-500 transition"
  //                     >
  //                       <Trash2 className="w-4 h-4" />
  //                     </button>
  //                   )}
  //                 </div>
  //                 <p className="text-[var(--text-primary)] leading-relaxed">{comment.comment}</p>
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <div className="w-full max-w-[1400px] mx-auto">
      {/* Kanban-style Comments Grid */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-6">Comments ({filteredComments.length})</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max">
          {filteredComments.map((comment) => (
            <div
              key={comment.id}
              className="bg-[var(--background-secondary)] rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-[var(--card-border)] hover:translate-y-[-2px]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-medium text-sm">
                    {comment.users?.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-medium text-[var(--text-primary)] text-sm">
                      {comment.users?.username}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {comment.date_added ? new Date(comment.date_added).toLocaleDateString() : 'No date'}
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
              <p className="text-sm text-[var(--text-primary)] leading-relaxed">{comment.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentsList;
