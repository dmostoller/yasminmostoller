import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { X } from 'lucide-react';
import { Comment, User } from '@/lib/types';

interface CommentFormProps {
  onAddComment: (comment: Comment) => void;
  paintingId: string;
  onChangeIsComFormVis: () => void;
  user: User;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onAddComment,
  paintingId,
  onChangeIsComFormVis,
  user,
}) => {
  const [error, setError] = useState<string | null>(null);

  const formSchema = yup.object().shape({
    comment: yup.string().required('Please enter a comment'),
  });

  const formik = useFormik({
    initialValues: {
      comment: '',
      date_added: `${new Date().toLocaleDateString('en-US')} ${new Date().toLocaleTimeString('en-US')}`,
      painting_id: parseInt(paintingId),
      user_id: user.id,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      fetch('/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      }).then((res) => {
        if (res.ok) {
          res.json().then((newComment: Comment) => {
            onAddComment(newComment);
            formik.resetForm();
          });
        } else {
          res.json().then((error) => setError(error.message));
        }
      });
    },
  });

  return (
    <div className="container mx-auto max-w-2xl px-4">
      <form className="w-full" onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <label className="block text-gray-700 text-sm font-medium mb-2">Add Comment</label>
            <button
              type="button"
              onClick={onChangeIsComFormVis}
              className="text-gray-500 hover:text-gray-700"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          {formik.errors.comment && (
            <p className="text-red-500 text-center text-sm mt-1">{formik.errors.comment}</p>
          )}
        </div>
        <div className="mb-4">
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-2 px-4 rounded-full hover:bg-teal-600 transition-colors duration-200"
          >
            Submit
          </button>
        </div>
        {error && <div className="text-red-500 text-center">{error}</div>}
      </form>
    </div>
  );
};

export default CommentForm;
