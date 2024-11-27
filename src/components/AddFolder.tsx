import { X } from 'lucide-react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useState } from 'react';
import { Folder } from '@/lib/types';

interface AddFolderProps {
  onToggleFolder: () => void;
  onAddFolder: (folder: Folder) => void;
}

export default function AddFolder({ onToggleFolder, onAddFolder }: AddFolderProps) {
  const [error, setError] = useState<string | null>(null);

  const formSchema = yup.object().shape({
    name: yup.string().required('Please enter a group name')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: ''
    },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch('/api/folders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });

        if (response.ok) {
          const newFolder = await response.json();
          onAddFolder(newFolder);
          formik.resetForm();
          onToggleFolder();
        } else {
          const errorData = await response.json();
          setError(errorData.message);
        }
      } catch (err) {
        setError('An error occurred while creating the folder');
      }
    }
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="relative flex w-full">
        <div className="relative flex w-full items-center">
          <input
            placeholder="Folder name......"
            value={formik.values.name}
            onChange={formik.handleChange}
            id="name"
            name="name"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-20 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <div className="absolute right-0 flex space-x-2 pr-2">
            <button
              type="button"
              onClick={onToggleFolder}
              className="rounded p-2 text-teal-600 hover:bg-teal-50"
            >
              <X className="h-5 w-5" />
            </button>
            <button type="submit" className="rounded bg-teal-600 px-4 py-2 text-white hover:bg-teal-700">
              Submit
            </button>
          </div>
        </div>
      </div>
      {formik.errors.name && <p className="mt-2 text-left text-sm text-red-600">{formik.errors.name}</p>}
      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
    </form>
  );
}
