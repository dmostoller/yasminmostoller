import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Event } from '@/lib/types';

export function useEvents() {
  const queryClient = useQueryClient();

  const eventsQuery = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await fetch('/api/events');
      if (!res.ok) {
        throw new Error(`Failed to fetch events: ${res.statusText}`);
      }
      return res.json();
    },
  });

  const createEventMutation = useMutation({
    mutationFn: async (newEvent: Partial<Event>) => {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });
      if (!res.ok) throw new Error('Failed to create event');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: async (updatedEvent: Partial<Event>) => {
      const res = await fetch(`/api/events/${updatedEvent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvent),
      });
      if (!res.ok) throw new Error('Failed to update event');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: number) => {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete event');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  return {
    events: eventsQuery.data ?? [],
    isLoading: eventsQuery.isLoading,
    error: eventsQuery.error,
    createEvent: createEventMutation.mutate,
    updateEvent: updateEventMutation.mutate,
    deleteEvent: deleteEventMutation.mutate,
  };
}
