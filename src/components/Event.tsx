// components/Event.tsx
import { useState } from 'react';
import Link from 'next/link';
// import { useUser } from '../context/user'
// import { useAdmin } from '../context/admin'
import { useSession } from 'next-auth/react';
import { Pencil, Trash2 } from 'lucide-react';

interface EventProps {
  id: string;
  name: string;
  venue: string;
  location: string;
  details: string;
  image_url: string;
  event_date: string;
  event_link: string;
  isAdmin: boolean;
  onDeleteEvent: (id: string) => void;
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
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{name}</h3>
          <p className="text-sm text-gray-500 mb-4">{event_date}</p>

          <p className="font-bold text-gray-700 mb-2">{venue}</p>
          <p className="font-bold text-gray-700 mb-4">{location}</p>
          <p className="text-gray-600 mb-6">{details}</p>

          <div className="flex gap-4 mt-4">
            {session?.user && isAdmin ? (
              <>
                <Link
                  href={`/events/${id}/edit`}
                  className="inline-flex items-center justify-center p-2 rounded-full bg-teal-500 text-white hover:bg-teal-600 transition-colors"
                >
                  <Pencil className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleDeleteEvent}
                  className="inline-flex items-center justify-center p-2 rounded-full bg-teal-500 text-white hover:bg-teal-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}