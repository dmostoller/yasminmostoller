// components/PostCommentForm.tsx
'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { X } from 'lucide-react';
import { User } from '@/lib/types';

interface PostCommentFormProps {
  onAddComment: (comment: any) => void;
  postId: string;
  onChangeIsComFormVis: () => void;
  user: User;
}

export default function PostCommentForm({
  onAddComment,
  postId,
  onChangeIsComFormVis,
  user,
}: PostCommentFormProps) {
  const [error, setError] = useState<string | null>(null);

  const formSchema = yup.object().shape({
    comment: yup.string().required('Please enter a comment'),
  });

  const formik = useFormik({
    initialValues: {
      comment: '',
      date_added: `${new Date().toLocaleDateString('en-US')} ${new Date().toLocaleTimeString('en-US')}`,
      post_id: parseInt(postId),
      user_id: user.id,
    },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      try {
        const res = await fetch('/api/post_comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (res.ok) {
          const newComment = await res.json();
          onAddComment(newComment);
          formik.resetForm();
        } else {
          const errorData = await res.json();
          setError(errorData.message);
        }
      } catch (err) {
        setError('Failed to submit comment');
      }
    },
  });

    return (
    <div className="container mx-auto max-w-2xl">
      <form onSubmit={formik.handleSubmit} className="bg-[var(--background-secondary)] shadow-sm rounded-lg p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="comment" className="block text-sm font-medium text-[var(--text-primary)]">
              Add Comment
            </label>
            <button
              type="button"
              onClick={onChangeIsComFormVis}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <textarea
            rows={2}
            id="comment"
            name="comment"
            value={formik.values.comment}
            onChange={formik.handleChange}
            placeholder="Your comment here"
            className="w-full rounded-md border-[var(--text-secondary)] shadow-sm focus:border-teal-500 focus:ring-teal-500 bg-[var(--background-secondary)] text-[var(--text-primary)]"
          />
          {formik.errors.comment && (
            <p className="text-red-500 text-center text-sm">{formik.errors.comment}</p>
          )}
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="w-full rounded-full bg-teal-500 py-2 px-4 text-sm font-medium text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </div>
      </form>
      {error && <div className="mt-2 text-red-500 text-center">{error}</div>}
    </div>
  );