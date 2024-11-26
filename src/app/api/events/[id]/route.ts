// app/api/events/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as yup from 'yup';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

const eventSchema = yup.object().shape({
  name: yup.string().required(),
  venue: yup.string().required(),
  location: yup.string().required(),
  details: yup.string().required(),
  image_url: yup.string().nullable(),
  event_date: yup.string().required(),
  event_link: yup.string().required()
});

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    const event = await prisma.events.findUnique({
      where: { id }
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    const body = await request.json();
    await eventSchema.validate(body);

    const sanitizedDetails = purify.sanitize(body.details, {
      ALLOWED_TAGS: [
        'p',
        'br',
        'strong',
        'em',
        'u',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'ul',
        'ol',
        'li',
        'blockquote',
        'a',
        'img',
        'span'
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'style']
    });

    const existingEvent = await prisma.events.findUnique({
      where: { id }
    });

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const updatedEvent = await prisma.events.update({
      where: { id },
      data: {
        name: body.name,
        venue: body.venue,
        location: body.location,
        details: sanitizedDetails,
        image_url: body.image_url || null,
        event_date: body.event_date,
        event_link: body.event_link
      }
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    if (error instanceof yup.ValidationError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error updating event' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    const existingEvent = await prisma.events.findUnique({
      where: { id }
    });

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    await prisma.events.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
