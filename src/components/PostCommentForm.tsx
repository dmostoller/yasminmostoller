// components/PostCommentForm.tsx
'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { User, PostComment } from '@/lib/types';
import { usePostComments } from '@/hooks/usePostComments';
import { SecondaryButton } from './buttons/SecondaryButton';

interface PostCommentFormProps {
  onAddComment: (comment: PostComment) => void;
  postId: number;
  user: User;
}

export default function PostCommentForm({ onAddComment, postId, user }: PostCommentFormProps) {
  const { addPostComment } = usePostComments();
  const [error, setError] = useState<string | null>(null);

  const formSchema = yup.object().shape({
    comment: yup.string().required('Please enter a comment'),
  });

  const formik = useFormik({
    initialValues: {
      comment: '',
      date_added: `${new Date().toLocaleDateString('en-US')} ${new Date().toLocaleTimeString('en-US')}`,
      post_id: postId,
      user_id: user.id,
    },
    validationSchema: formSchema,
    onSubmit: values => {
      addPostComment(values, {
        onSuccess: newComment => {
          onAddComment(newComment);
          formik.resetForm();
        },
        onError: error => {
          setError(error.message);
        },
      });
    },
  });

  return (
    <div className="container max-w-full md:max-w-xs">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-[var(--background-secondary)] shadow-sm rounded-lg p-4"
      >
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-[var(--text-secondary)]"
            >
              Add A Comment
            </label>
          </div>
          <textarea
            rows={3}
            id="comment"
            name="comment"
            value={formik.values.comment}
            onChange={formik.handleChange}
            placeholder="Your comment here"
            className="w-full rounded-md border border-[var(--card-border)] shadow-sm focus:border-teal-500 focus:ring-teal-500 bg-[var(--background-secondary)] text-[var(--text-primary)]"
          />
          {formik.errors.comment && (
            <p className="text-red-500 text-center text-sm">{formik.errors.comment}</p>
          )}
        </div>
        <div className="mt-1">
          <SecondaryButton type="submit" className="w-full" text="Comment" />
        </div>
      </form>
      {error && <div className="mt-2 text-red-500 text-center">{error}</div>}
    </div>
  );
}
