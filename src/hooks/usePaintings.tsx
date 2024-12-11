import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Painting } from '@/lib/types';

export function usePaintings() {
  return useQuery({
    queryKey: ['paintings'],
    queryFn: async () => {
      const res = await fetch('/api/paintings');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json() as Promise<Painting[]>;
    },
  });
}

export function useGetPainting(id: number) {
  return useQuery({
    queryKey: ['paintings', id],
    queryFn: async () => {
      const res = await fetch(`/api/paintings/${id}`);
      if (!res.ok) throw new Error('Failed to fetch painting');
      return res.json() as Promise<Painting>;
    },
  });
}

export function useCreatePainting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPainting: Omit<Painting, 'id'>) => {
      const res = await fetch('/api/paintings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPainting),
      });
      if (!res.ok) throw new Error('Failed to create painting');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paintings'] });
    },
  });
}
export function useUpdatePainting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (painting: Painting) => {
      const res = await fetch(`/api/paintings/${painting.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(painting),
      });
      if (!res.ok) throw new Error('Failed to update painting');
      return res.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['paintings'] });
      // Update the individual painting cache
      queryClient.setQueryData(['paintings', variables.id], data);
    },
  });
}

export function useDeletePainting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/paintings/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete painting');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paintings'] });
    },
  });
}
