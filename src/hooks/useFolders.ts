import { useQuery } from '@tanstack/react-query';
import { Folder } from '@/lib/types';

export function useFolders() {
  return useQuery<Folder[]>({
    queryKey: ['folders'],
    queryFn: async () => {
      const res = await fetch('/api/folders');
      if (!res.ok) {
        throw new Error('Failed to fetch folders');
      }
      return res.json();
    },
  });
}
