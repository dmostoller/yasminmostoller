'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
import { useEvents } from '@/hooks/useEvents';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function EditEvent({ params }: { params: Promise<{ id: number }> }) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { events, updateEvent, isLoading } = useEvents();

  const currentEvent = events.find(e => {
    return Number(e.id) === Number(id);
  });

  const formSchema = yup.object().shape({
    name: yup
      .string()
      .required('Please enter a title')
      .min(2, 'Name must be more than two characters long'),
    venue: yup.string().required('Please enter a venue'),
    location: yup.string().required('Please enter a location'),
    details: yup.string().required('Please enter event details'),
    event_date: yup.date().required('Please enter a date'),
    event_link: yup.string().required('Please enter an event link'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentEvent?.name || '',
      venue: currentEvent?.venue || '',
      location: currentEvent?.location || '',
      details: currentEvent?.details || '',
      event_date: currentEvent?.event_date || '',
      event_link: currentEvent?.event_link || '',
    },
    validationSchema: formSchema,
    validateOnMount: false,
    onSubmit: values => {
      updateEvent(
        { ...values, id },
        {
          onSuccess: () => {
            router.push('/events');
          },
          onError: error => {
            setError(error.message);
          },
        }
      );
    },
  });

  if (isLoading) {
    return (
      <div className="text-center mt-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      {error && <h2 className="text-center text-red-500">{error}</h2>}
      <div className="container mx-auto min-h-screen max-w-2xl px-4 mt-16 mb-6">
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          <div className="flex items-center justify-center border-b border-[var(--text-secondary)] pb-4">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Edit Event</h1>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="flex items-center justify-between text-[var(--text-primary)]">
                Upload image then enter event info...
                <Link
                  href="/events"
                  className="flex items-center text-teal-600 hover:text-teal-700"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Events
                </Link>
              </span>
            </label>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <input
                type="text"
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                placeholder="Event Name..."
                className="w-full rounded-md border border-[var(--text-secondary)] px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-[var(--background-secondary)] text-[var(--text-primary)]"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-center text-sm text-red-500">{formik.errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <input
                type="text"
                name="venue"
                value={formik.values.venue}
                onChange={formik.handleChange}
                placeholder="Venue..."
                className="w-full rounded-md border border-[var(--text-secondary)] px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-[var(--background-secondary)] text-[var(--text-primary)]"
              />
              {formik.touched.venue && formik.errors.venue && (
                <p className="text-center text-sm text-red-500">{formik.errors.venue}</p>
              )}
            </div>

            <div className="space-y-2">
              <input
                type="text"
                name="location"
                value={formik.values.location}
                onChange={formik.handleChange}
                placeholder="Location address..."
                className="w-full rounded-md border border-[var(--text-secondary)] px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-[var(--background-secondary)] text-[var(--text-primary)]"
              />
              {formik.touched.location && formik.errors.location && (
                <p className="text-center text-sm text-red-500">{formik.errors.location}</p>
              )}
            </div>

            <div className="space-y-2">
              <input
                type="date"
                name="event_date"
                value={formik.values.event_date}
                onChange={formik.handleChange}
                className="w-full rounded-md border border-[var(--text-secondary)] px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-[var(--background-secondary)] text-[var(--text-primary)]"
              />
              {formik.touched.event_date && formik.errors.event_date && (
                <p className="text-center text-sm text-red-500">{formik.errors.event_date}</p>
              )}
            </div>

            <div className="space-y-2">
              <input
                type="text"
                name="event_link"
                value={formik.values.event_link}
                onChange={formik.handleChange}
                placeholder="Link to Event..."
                className="w-full rounded-md border border-[var(--text-secondary)] px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-[var(--background-secondary)] text-[var(--text-primary)]"
              />
              {formik.touched.event_link && formik.errors.event_link && (
                <p className="text-center text-sm text-red-500">{formik.errors.event_link}</p>
              )}
            </div>

            <div className="space-y-2">
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINY_API_KEY}
                init={{
                  height: 400,
                  menubar: false,
                  skin: 'oxide-dark',
                  content_css: 'dark',
                  plugins: [
                    'advlist',
                    'autolink',
                    'lists',
                    'link',
                    'image',
                    'charmap',
                    'preview',
                    'anchor',
                    'searchreplace',
                    'visualblocks',
                    'code',
                    'fullscreen',
                    'insertdatetime',
                    'media',
                    'table',
                    'help',
                    'wordcount',
                  ],
                  toolbar:
                    'undo redo | formatselect | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  setup: editor => {
                    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    editor.options.set('skin', isDarkMode ? 'oxide-dark' : 'oxide');
                    editor.options.set('content_css', isDarkMode ? 'dark' : 'default');

                    // Listen for system theme changes
                    window
                      .matchMedia('(prefers-color-scheme: dark)')
                      .addEventListener('change', e => {
                        editor.options.set('skin', e.matches ? 'oxide-dark' : 'oxide');
                        editor.options.set('content_css', e.matches ? 'dark' : 'default');
                      });
                  },
                }}
                value={formik.values.details}
                onEditorChange={content => {
                  formik.setFieldValue('details', content);
                }}
              />
              {formik.errors.details && (
                <p className="text-center text-sm text-red-500">{formik.errors.details}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-teal-500 py-2 text-white transition-colors hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-2"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
