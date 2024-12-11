'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import UploadWidget from '@/components/UploadWidget';
import UploadVideoWidget from '@/components/UploadVideoWidget';
import { CldVideoPlayer } from 'next-cloudinary';
import { Editor } from '@tinymce/tinymce-react';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { CldImage } from 'next-cloudinary';

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
          // const post: Post = await res.json();
          router.push('/news');
        } else {
          const errorData = await res.json();
          setError(errorData.message);
        }
      } catch (err) {
        setError('An error occurred while creating the post' + err);
      }
    },
  });

  return (
    <>
      {error && <h2 className="text-error-foreground text-center">{error}</h2>}
      <div className="container mx-auto min-h-screen max-w-5xl px-4 mt-16 mb-6">
        <div className="flex items-center justify-center border-b border-border pb-4">
          <h4 className="text-center text-2xl font-medium text-foreground">Add New Post</h4>
        </div>
        <label className="flex items-center justify-between text-foreground py-2 mb-2">
          <span>Upload image or video, then enter post info...</span>
          <Link href="/news" className="flex items-center text-teal-600 hover:text-teal-700">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to News page
          </Link>
        </label>

        <form
          className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8"
          onSubmit={formik.handleSubmit}
        >
          {/* Left Column - Media Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <UploadWidget onSetImageUrl={setImageUrl} />
              <UploadVideoWidget onSetVideoUrl={setVideoUrl} />

              {imageUrl && (
                <div className="relative h-64 w-full lg:h-max">
                  <CldImage
                    src={imageUrl}
                    alt="Post image"
                    width={800}
                    height={600}
                    className="rounded-md object-contain w-full h-full"
                  />
                </div>
              )}

              {videoUrl && videoUrl !== 'undefined' && videoUrl !== 'null' && (
                <div className="aspect-video rounded-md">
                  <CldVideoPlayer
                    width="1080"
                    height="1920"
                    src={videoUrl}
                    colors={{
                      accent: '#ff0000',
                      base: '#000000',
                    }}
                  />
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
          </div>

          {/* Right Column - Content Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Title</label>
              <input
                type="text"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                placeholder="Post title..."
                className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
              />
              {formik.errors.title && (
                <p className="text-center text-sm text-error-foreground">{formik.errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Content</label>
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
                    'undo redo | formatselect | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                  setup: (editor) => {
                    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    editor.options.set('skin', isDarkMode ? 'oxide-dark' : 'oxide');
                    editor.options.set('content_css', isDarkMode ? 'dark' : 'default');

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
                <p className="text-center text-sm text-error-foreground">{formik.errors.content}</p>
              )}
            </div>

            <PrimaryButton
              type="submit"
              text="Submit"
              className="w-full rounded-md"
              disabled={formik.isSubmitting}
              isLoading={formik.isSubmitting}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default NewPostPage;
