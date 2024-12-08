'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Post } from '@/lib/types';
import UploadWidget from '@/components/UploadWidget';
import UploadVideoWidget from '@/components/UploadVideoWidget';
import VideoPlayer from '@/components/VideoPlayer';
import { Editor } from '@tinymce/tinymce-react';

const NewPostPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const formSchema = yup.object().shape({
    title: yup.string().required('Please enter a title').min(2, 'name must be more than two characters long'),
    content: yup.string().required('Please enter content for your post'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: '',
      content: '',
      image_url: imageUrl ?? '',
      video_url: videoUrl ?? '',
    },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      try {
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (res.ok) {
          const post: Post = await res.json();
          router.push('/news');
        } else {
          const errorData = await res.json();
          setError(errorData.message);
        }
      } catch (err) {
        setError('An error occurred while creating the post');
      }
    },
  });

  return (
    <>
      {error && <h2 className="text-error-foreground text-center">{error}</h2>}
      <div className="container mx-auto max-w-2xl min-h-screen px-4 mt-16 mb-6">
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          <div className="flex items-center justify-center border-b border-border pb-4">
            <h1 className="text-2xl font-bold text-foreground">Add New Post</h1>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="flex items-center justify-between text-foreground">
                Upload image or video then enter post info...
                <Link href="/news" className="text-teal-600 hover:text-teal-700 flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to News page
                </Link>
              </span>
            </label>

            <UploadWidget onSetImageUrl={setImageUrl} />
            <UploadVideoWidget onSetVideoUrl={setVideoUrl} />

            {imageUrl && (
              <div className="mt-2">
                <Image
                  src={imageUrl}
                  alt="Uploaded preview"
                  width={500}
                  height={300}
                  className="rounded-lg mx-auto"
                />
              </div>
            )}

            {videoUrl && videoUrl !== 'undefined' && videoUrl !== 'null' && (
              <div className="mt-2">
                <VideoPlayer videoUrl={videoUrl} />
              </div>
            )}

            <input
              type="hidden"
              name="image_url"
              value={formik.values.image_url}
              onChange={formik.handleChange}
            />
            <input
              type="hidden"
              name="video_url"
              value={formik.values.video_url}
              onChange={formik.handleChange}
            />
          </div>

          <div className="space-y-2">
            <input
              type="text"
              name="title"
              value={formik.values.title}
              placeholder="Post title..."
              onChange={formik.handleChange}
              className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            {formik.errors.title && (
              <p className="text-error-foreground text-center text-sm">{formik.errors.title}</p>
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
                placeholder: 'Type your event description here...',
                toolbar:
                  'undo redo | formatselect | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                setup: (editor) => {
                  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  editor.options.set('skin', isDarkMode ? 'oxide-dark' : 'oxide');
                  editor.options.set('content_css', isDarkMode ? 'dark' : 'default');

                  // Listen for system theme changes
                  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                    editor.options.set('skin', e.matches ? 'oxide-dark' : 'oxide');
                    editor.options.set('content_css', e.matches ? 'dark' : 'default');
                  });
                },
              }}
              value={formik.values.content}
              onEditorChange={(content) => {
                formik.setFieldValue('content', content);
              }}
            />
            {formik.errors.content && (
              <p className="text-error-foreground text-center text-sm">{formik.errors.content}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-full transition-colors duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default NewPostPage;
