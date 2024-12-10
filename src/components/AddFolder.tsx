import { X } from 'lucide-react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useState } from 'react';
import { Folder } from '@/lib/types';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';

interface AddFolderProps {
  onToggleFolder: () => void;
  onAddFolder: (folder: Folder) => void;
}

export default function AddFolder({ onToggleFolder, onAddFolder }: AddFolderProps) {
  const [error, setError] = useState<string | null>(null);

  const formSchema = yup.object().shape({
    name: yup.string().required('Please enter a group name'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: '',
    },
    validationSchema: formSchema,
    onSubmit: async values => {
      try {
        const response = await fetch('/api/folders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
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
        setError('An error occurred while creating the folder' + err);
      }
    },
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
            className="w-80 pl-3 py-2 border border-[var(--text-secondary)] rounded-md shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
              bg-[var(--background-secondary)] text-[var(--text-primary)]"
          />
          <div className="absolute right-0 flex space-x-2">
            <button
              type="button"
              onClick={onToggleFolder}
              className="pl-1 text-teal-600 hover:text-teal-700 transition-colors bg-[var(--background-secondary)]"
            >
              <X className="h-5 w-5" />
            </button>
            <PrimaryButton type="submit" text="Submit" className="rounded-md" />
          </div>
        </div>
      </div>
      {formik.errors.name && (
        <p className="mt-2 text-left text-sm text-[var(--text-primary)]">{formik.errors.name}</p>
      )}
      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
    </form>
  );
}
