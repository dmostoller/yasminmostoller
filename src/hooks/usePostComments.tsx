// hooks/usePostComments.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PostComment } from '@/lib/types';

export function usePostComments() {
  const queryClient = useQueryClient();

  const postCommentsQuery = useQuery<PostComment[]>({
    queryKey: ['post_comments'],
    queryFn: async () => {
      const res = await fetch('/api/post_comments');
      if (!res.ok) throw new Error(`Failed to fetch post comments: ${res.statusText}`);
      return res.json();
    },
  });

  const addPostCommentMutation = useMutation({
    mutationFn: async (newComment: Partial<PostComment>) => {
      const res = await fetch('/api/post_comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment),
      });
      if (!res.ok) throw new Error('Failed to add post comment');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post_comments'] });
    },
  });

  const deletePostCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      const res = await fetch(`/api/post_comments/${commentId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete post comment');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post_comments'] });
    },
  });

  return {
    postComments: postCommentsQuery.data ?? [],
    isLoading: postCommentsQuery.isLoading,
    error: postCommentsQuery.error,
    addPostComment: addPostCommentMutation.mutate,
    deletePostComment: deletePostCommentMutation.mutate,
  };
}
