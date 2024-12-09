import { useQuery } from '@tanstack/react-query';

export function usePaintings() {
  return useQuery({
    queryKey: ['paintings'],
    queryFn: async () => {
      const res = await fetch('/api/paintings');
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    },
  });
}
