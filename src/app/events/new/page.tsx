'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Event } from '@/lib/types';
import UploadWidget from '@/components/UploadWidget';
import { Editor } from '@tinymce/tinymce-react';

export default function AddEvent() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  const formSchema = yup.object().shape({
    name: yup.string().required('Please enter a title'),
    venue: yup.string().required('Please enter a venue'),
    location: yup.string().required('Please enter a location'),
    details: yup.string().required('Please enter event details'),
    image_url: yup.string().required('Please enter an image link'),
    event_date: yup.date().required('Please enter a date'),
    event_link: yup.string().required('Please enter an event link')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: '',
      venue: '',
      location: '',
      details: '',
      image_url: imageUrl,
      event_date: '',
      event_link: ''
    },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      try {
        const res = await fetch('/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });

        if (res.ok) {
          const event = await res.json();
          router.push('/events');
        } else {
          const errorData = await res.json();
          setError(errorData.message);
        }
      } catch (err) {
        setError('An error occurred while submitting the form');
      }
    }
  });

  return (
    <>
      {error && <h2 className="text-red-500 text-center">{error}</h2>}
      <div className="container mx-auto px-4 mt-16 mb-6 min-h-screen max-w-2xl">
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          <div className="flex items-center justify-center border-b border-gray-200 pb-4">
            <h4 className="text-2xl font-semibold">Add New Event</h4>
          </div>

          <div className="space-y-4">
            <label className="flex justify-between items-center">
              <span>Upload image, then enter event info...</span>
              <Link href="/events" className="flex items-center text-teal-600 hover:text-teal-700">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Events Page
              </Link>
            </label>

            <UploadWidget onSetImageUrl={setImageUrl} />

            {imageUrl && (
              <div className="relative w-full h-64">
                <Image src={imageUrl} alt="Event preview" fill className="rounded-md object-cover" />
              </div>
            )}

            <input
              type="text"
              name="image_url"
              value={formik.values.image_url}
              onChange={formik.handleChange}
              className="hidden"
            />
            {formik.errors.image_url && <p className="text-red-500 text-center">{formik.errors.image_url}</p>}
          </div>

          {/* Event Name */}
          <div>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              placeholder="Event Name..."
              onChange={formik.handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            {formik.errors.name && <p className="text-red-500 text-center mt-1">{formik.errors.name}</p>}
          </div>

          {/* Venue */}
          <div>
            <input
              type="text"
              name="venue"
              value={formik.values.venue}
              placeholder="Venue..."
              onChange={formik.handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            {formik.errors.venue && <p className="text-red-500 text-center mt-1">{formik.errors.venue}</p>}
          </div>

          {/* Location */}
          <div>
            <input
              type="text"
              name="location"
              value={formik.values.location}
              placeholder="Location address..."
              onChange={formik.handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            {formik.errors.location && (
              <p className="text-red-500 text-center mt-1">{formik.errors.location}</p>
            )}
          </div>

          {/* Event Date */}
          <div>
            <input
              type="date"
              name="event_date"
              value={formik.values.event_date}
              onChange={formik.handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            {formik.errors.event_date && (
              <p className="text-red-500 text-center mt-1">{formik.errors.event_date}</p>
            )}
          </div>

          {/* Event Link */}
          <div>
            <input
              type="text"
              name="event_link"
              value={formik.values.event_link}
              placeholder="Link to Event..."
              onChange={formik.handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            {formik.errors.event_link && (
              <p className="text-red-500 text-center mt-1">{formik.errors.event_link}</p>
            )}
          </div>

          {/* Details */}
          <div>
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINY_API_KEY}
              init={{
                height: 400,
                menubar: false,
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
                  'wordcount'
                ],
                convert_urls: true,
                link_default_target: '_blank',
                link_assume_external_targets: true,
                placeholder: 'Type your post content here...',
                toolbar:
                  'undo redo | formatselect | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help'
              }}
              value={formik.values.details}
              onEditorChange={(content) => {
                formik.setFieldValue('details', content);
              }}
            />
            {formik.errors.details && (
              <p className="text-red-500 text-center mt-1">{formik.errors.details}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-full transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
