// components/Event.tsx
import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Event } from '@/lib/types';
import FormattedContent from '@/components/FormattedContent';
import { PrimaryIconButton } from './buttons/PrimaryIconButton';

interface EventProps extends Event {
  isAdmin: boolean;
  onDeleteEvent: (id: number) => void;
}

export default function Event({
  id,
  name,
  venue,
  location,
  details,
  image_url,
  event_date,
  isAdmin,
  event_link,
  onDeleteEvent,
}: EventProps) {
  const { data: session } = useSession();

  const handleDeleteEvent = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await fetch(`/api/events/${id}`, {
          method: 'DELETE',
        });
        onDeleteEvent(id);
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  return (
    <div className="w-full px-4 py-6">
      <div className="bg-[var(--background-secondary)] border border-[var(--card-border)] rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">{name}</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">{event_date}</p>

          <p className="font-bold text-[var(--text-primary)] mb-2">{venue}</p>
          <p className="font-bold text-[var(--text-primary)] mb-4">{location}</p>
          <div className="mt-4 text-[var(--text-secondary)]">
            <FormattedContent content={details || ''} />
          </div>

          <div className="flex gap-4 mt-4">
            {session?.user && isAdmin ? (
              <>
                <PrimaryIconButton href={`/events/${id}/edit`} icon={Pencil} />
                <PrimaryIconButton onClick={handleDeleteEvent} icon={Trash2} />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
