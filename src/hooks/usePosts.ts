import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Post } from '@/lib/types';

export function usePosts() {
  const queryClient = useQueryClient();

  const query = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch('/api/posts');
      if (!res.ok) {
        throw new Error('Failed to fetch posts');
      }
      return res.json();
    },
  });

  const deletePost = useMutation({
    mutationFn: async (postId: string) => {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to delete post');
      }
      return res.json();
    },
    onSuccess: () => {
      // Invalidate posts query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  return {
    ...query,
    deletePost,
  };
}

export function useGetPost(id: number) {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: async () => {
      const res = await fetch(`/api/posts/${id}`);
      if (!res.ok) throw new Error('Failed to fetch post');
      return res.json() as Promise<Post>;
    },
  });
}
