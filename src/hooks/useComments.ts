// hooks/useComments.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Comment } from '@/lib/types';

export function useComments() {
  const queryClient = useQueryClient();

  const commentsQuery = useQuery<Comment[]>({
    queryKey: ['comments'],
    queryFn: async () => {
      const res = await fetch('/api/comments');
      if (!res.ok) throw new Error(`Failed to fetch comments: ${res.statusText}`);
      return res.json();
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async (newComment: Partial<Comment>) => {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment),
      });
      if (!res.ok) throw new Error('Failed to add comment');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete comment');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });

  return {
    comments: commentsQuery.data ?? [],
    isLoading: commentsQuery.isLoading,
    error: commentsQuery.error,
    addComment: addCommentMutation.mutate,
    deleteComment: deleteCommentMutation.mutate,
  };
}
