// app/api/events/route.ts
import { NextRequest, NextResponse } from 'next/server';
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

export async function GET() {
  try {
    const events = await prisma.events.findMany({
      orderBy: {
        event_date: 'asc'
      }
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Error fetching events' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    await eventSchema.validate(body);

    // Sanitize the HTML content in details
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

    const event = await prisma.events.create({
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

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    if (error instanceof yup.ValidationError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error creating event' }, { status: 500 });
  }
}
