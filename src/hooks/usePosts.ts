// hooks/usePosts.ts
import { useQuery } from '@tanstack/react-query';
import { Post } from '@/lib/types';

export function usePosts() {
  return useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch('/api/posts');
      if (!res.ok) {
        throw new Error('Failed to fetch posts');
      }
      return res.json();
    },
  });
}
