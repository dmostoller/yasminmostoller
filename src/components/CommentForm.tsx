import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { X } from 'lucide-react';
import { Comment, User } from '@/lib/types';
import { PrimaryButton } from './buttons/PrimaryButton';
import { useComments } from '@/hooks/useComments';

interface CommentFormProps {
  onAddComment: (comment: Comment) => void;
  paintingId: number;
  onChangeIsComFormVis: () => void;
  user: User;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onAddComment,
  paintingId,
  onChangeIsComFormVis,
  user,
}) => {
  const { addComment } = useComments();
  const [error, setError] = useState<string | null>(null);

  const formSchema = yup.object().shape({
    comment: yup.string().required('Please enter a comment'),
  });

  const formik = useFormik({
    initialValues: {
      comment: '',
      date_added: `${new Date().toLocaleDateString('en-US')} ${new Date().toLocaleTimeString('en-US')}`,
      painting_id: paintingId,
      user_id: user.id,
    },
    validationSchema: formSchema,
    onSubmit: values => {
      addComment(values, {
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
    <div className="container mx-auto max-w-2xl px-4">
      <form className="w-full" onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
              Add Comment
            </label>
            <button
              type="button"
              onClick={onChangeIsComFormVis}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <X size={20} />
            </button>
          </div>
          <textarea
            rows={2}
            id="comment"
            name="comment"
            value={formik.values.comment}
            onChange={formik.handleChange}
            placeholder="Your comment here"
            className="w-full px-3 py-2 border border-[var(--text-secondary)] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-[var(--background)] text-[var(--text-primary)]"
          />
          {formik.errors.comment && (
            <p className="text-red-500 text-center text-sm mt-1">{formik.errors.comment}</p>
          )}
        </div>
        <div className="mb-4">
          <PrimaryButton type="submit" className="rounded-full w-full">
            Submit
          </PrimaryButton>
        </div>
        {error && <div className="text-red-500 text-center">{error}</div>}
      </form>
    </div>
  );
};

export default CommentForm;
