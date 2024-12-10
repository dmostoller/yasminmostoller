// app/posts/[id]/edit/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Post } from '@/lib/types';
import UploadWidget from '@/components/UploadWidget';
import UploadVideoWidget from '@/components/UploadVideoWidget';
import VideoPlayer from '@/components/VideoPlayer';
import { Editor } from '@tinymce/tinymce-react';

export default function EditPost({ params }: { params: Promise<{ id: number }> }) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<Post>({
    id: id,
    title: '',
    content: '',
    image_url: '',
    video_url: '',
  });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then(res => res.json())
      .then(post => {
        setPost(post);
        setImageUrl(post.image_url || null);
        setVideoUrl(post.video_url || null);
      });
  }, [id]);

  const formSchema = yup.object().shape({
    title: yup
      .string()
      .required('Please enter a title')
      .min(2, 'Name must be more than two characters long'),
    content: yup.string().required('Please enter content for your post'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: post.title || '',
      content: post.content || '',
      image_url: imageUrl || '',
      video_url: videoUrl || '',
    },
    validationSchema: formSchema,
    validateOnMount: false,
    onSubmit: async values => {
      const submitValues = {
        ...values,
        image_url: values.image_url || null,
        video_url: values.video_url || null,
      };
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitValues),
      });

      if (res.ok) {
        // const post = await res.json();
        router.push(`/news/${id}`);
      } else {
        const error = await res.json();
        setError(error.message);
      }
    },
  });

  return (
    <>
      {error && <h2 className="text-center text-error-foreground">{error}</h2>}
      <div className="container mx-auto min-h-screen max-w-2xl px-4 mt-16 mb-6">
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          <div className="flex items-center justify-center border-b border-border pb-4">
            <h1 className="text-2xl font-bold text-foreground">Edit Post</h1>
          </div>
          <div className="space-y-4">
            <label className="block">
              <span className="flex items-center justify-between text-foreground">
                Upload image or video then enter post info...
                <Link
                  href={`/news/${id}`}
                  className="flex items-center text-teal-600 hover:text-teal-700"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to post
                </Link>
              </span>
            </label>
            <UploadWidget onSetImageUrl={setImageUrl} />
            <UploadVideoWidget onSetVideoUrl={setVideoUrl} />

            {imageUrl && (
              <div className="relative h-64 w-full overflow-hidden rounded-lg">
                <Image src={imageUrl} alt="Post image" fill className="object-cover" />
              </div>
            )}

            {videoUrl && videoUrl !== 'undefined' && videoUrl !== 'null' && (
              <div className="aspect-video overflow-hidden rounded-lg">
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
            <label htmlFor="title" className="block text-sm font-medium text-foreground">
              Post Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              placeholder="Post title..."
              className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-center text-sm text-error-foreground">{formik.errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium text-foreground">
              Post Content:
            </label>
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
              value={formik.values.content}
              onEditorChange={content => {
                formik.setFieldValue('content', content);
              }}
            />
            {formik.errors.content && (
              <p className="text-center text-sm text-error-foreground">{formik.errors.content}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-teal-500 py-2 text-white transition-colors hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-2"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
