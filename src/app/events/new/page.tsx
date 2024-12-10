'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
import { useEvents } from '@/hooks/useEvents';

export default function AddEvent() {
  const router = useRouter();
  const { createEvent } = useEvents();
  const [error, setError] = useState<string | null>(null);

  const formSchema = yup.object().shape({
    name: yup.string().required('Please enter a title'),
    venue: yup.string().required('Please enter a venue'),
    location: yup.string().required('Please enter a location'),
    details: yup.string().required('Please enter event details'),
    event_date: yup.date().required('Please enter a date'),
    event_link: yup.string().required('Please enter an event link'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: '',
      venue: '',
      location: '',
      details: '',
      event_date: '',
      event_link: '',
    },
    validationSchema: formSchema,
    onSubmit: values => {
      createEvent(values, {
        onSuccess: () => {
          router.push('/events');
        },
        onError: error => {
          setError(error.message);
        },
      });
    },
  });

  return (
    <>
      {error && <h2 className="text-red-500 text-center">{error}</h2>}
      <div className="container mx-auto px-4 mt-16 mb-6 min-h-screen max-w-2xl">
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          <div className="flex items-center justify-center border-b border-[var(--text-secondary)] pb-4">
            <h4 className="text-2xl font-semibold text-[var(--text-primary)]">Add New Event</h4>
          </div>

          <div className="space-y-4">
            <label className="flex justify-between items-center text-[var(--text-primary)]">
              <span>Enter event info...</span>
              <Link href="/events" className="flex items-center text-teal-600 hover:text-teal-700">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Events Page
              </Link>
            </label>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <input
                type="text"
                name="name"
                value={formik.values.name}
                placeholder="Event Name..."
                onChange={formik.handleChange}
                className="w-full rounded-md border border-[var(--text-secondary)] px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-[var(--background-secondary)] text-[var(--text-primary)]"
              />
              {formik.errors.name && (
                <p className="text-red-500 text-center text-sm">{formik.errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <input
                type="text"
                name="venue"
                value={formik.values.venue}
                placeholder="Venue..."
                onChange={formik.handleChange}
                className="w-full rounded-md border border-[var(--text-secondary)] px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-[var(--background-secondary)] text-[var(--text-primary)]"
              />
              {formik.errors.venue && (
                <p className="text-red-500 text-center text-sm">{formik.errors.venue}</p>
              )}
            </div>
            <div className="space-y-2">
              <input
                type="text"
                name="location"
                value={formik.values.location}
                placeholder="Location address..."
                onChange={formik.handleChange}
                className="w-full rounded-md border border-[var(--text-secondary)] px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-[var(--background-secondary)] text-[var(--text-primary)]"
              />
              {formik.errors.location && (
                <p className="text-red-500 text-center text-sm">{formik.errors.location}</p>
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
              {formik.errors.event_date && (
                <p className="text-red-500 text-center text-sm">{formik.errors.event_date}</p>
              )}
            </div>
            <div className="space-y-2">
              <input
                type="text"
                name="event_link"
                value={formik.values.event_link}
                placeholder="Link to Event..."
                onChange={formik.handleChange}
                className="w-full rounded-md border border-[var(--text-secondary)] px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-[var(--background-secondary)] text-[var(--text-primary)]"
              />
              {formik.errors.event_link && (
                <p className="text-red-500 text-center text-sm">{formik.errors.event_link}</p>
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
                  convert_urls: true,
                  link_default_target: '_blank',
                  link_assume_external_targets: true,
                  placeholder: 'Type your post content here...',
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
                <p className="text-red-500 text-center text-sm">{formik.errors.details}</p>
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
