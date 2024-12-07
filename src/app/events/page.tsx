'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Event from '@/components/Event';
import { Plus } from 'lucide-react';
import { Metadata } from 'next';
import { useSession } from 'next-auth/react';
import { Event as EventType } from '@/lib/types';

const metadata: Metadata = {
  title: 'Yasmin Mostoller | Exhibitions',
  description: 'Imagination and Emotion',
  openGraph: {
    title: 'Yasmin Mostoller | Exhibitions',
    description: 'Imagination and Emotion',
    type: 'website',
    images: ['https://yasminmostoller.com/images/slider2.jpg'],
    url: 'https://yasminmostoller.com/events',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yasmin Mostoller | Exhibitions',
    description: 'Imagination and Emotion',
    images: ['https://yasminmostoller.com/images/slider2.jpg'],
  },
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const { data: session } = useSession();
  const isAdmin = session?.user?.is_admin ?? false;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch('/api/events');

        if (!res.ok) {
          throw new Error(`Failed to fetch events: ${res.statusText}`);
        }

        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err instanceof Error ? err.message : 'Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const deleteEvent = (deleted_event_id: number) => {
    setEvents((events) => events.filter((event) => event.id !== deleted_event_id));
  };

  const sortedEvents = events.sort((a, b) => ((a.event_date ?? 0) > (b.event_date ?? 0) ? -1 : 1));

  if (isLoading) {
    return (
      <div className="container mx-auto min-h-screen flex items-center justify-center bg-[var(--background-primary)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
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
              <p className="text-sm text-[var(--text-primary)]">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen bg-[var(--background-primary)]">
      <div className="mt-12 mb-5 text-left container mx-auto px-4">
        {session?.user && isAdmin && (
          <Link
            href="/events/new"
            className="w-full flex items-center justify-center px-4 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors group"
            tabIndex={0}
          >
            <span className="block group-hover:hidden">
              <Plus className="h-6 w-6" />
            </span>
            <span className="hidden group-hover:block">Create New Event</span>
          </Link>
        )}

        <div className="mt-2">
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
