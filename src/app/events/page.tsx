'use client';

import { useEvents } from '@/hooks/useEvents';
import Event from '@/components/Event';
import { Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { useQueryClient } from '@tanstack/react-query';
import { Event as EventType } from '@/lib/types';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function EventsPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.is_admin ?? false;
  const { data: events, isLoading, error } = useEvents();
  const queryClient = useQueryClient();

  const deleteEvent = (deleted_event_id: number) => {
    queryClient.setQueryData(['events'], (oldData: EventType[] | undefined) =>
      oldData ? oldData.filter((event) => event.id !== deleted_event_id) : []
    );
  };

  const sortedEvents = events?.sort((a, b) => ((a.event_date ?? 0) > (b.event_date ?? 0) ? -1 : 1)) ?? [];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto min-h-screen flex items-center justify-center bg-[var(--background-primary)]">
        <div className="bg-[var(--background-secondary)] border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-[var(--text-primary)]">{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen bg-[var(--background-primary)]">
      <div className="mt-12 mb-5 text-center container mx-auto px-4">
        {session?.user && isAdmin && (
          <PrimaryButton
            href="/events/new"
            icon={Plus}
            hoverText="Create New Event"
            className="w-60 rounded-full"
            showTextOnHover
          >
            <span className="block group-hover:hidden">
              <Plus className="h-6 w-6" />
            </span>
            <span className="hidden group-hover:block">Create New Event</span>
          </PrimaryButton>
        )}

        <div className="mt-2 text-left">
          <div className="grid grid-cols-1 gap-2">
            {sortedEvents.map((event) => (
              <Event
                key={event.id}
                id={event.id}
                name={event.name}
                location={event.location}
                venue={event.venue}
                details={event.details}
                image_url={event.image_url}
                event_date={event.event_date}
                event_link={event.event_link}
                isAdmin={isAdmin}
                onDeleteEvent={deleteEvent}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
