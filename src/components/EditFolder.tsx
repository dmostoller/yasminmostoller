'use client';

import { useFormik } from 'formik';
import { X, Check } from 'lucide-react';
import * as yup from 'yup';
import { useState } from 'react';
import { Folder } from '@/lib/types';

interface EditFolderProps {
  name: string;
  id: number;
  setFolderName: (name: string) => void;
  onToggleEdit: () => void;
  onUpdateFolders?: (folder: Folder) => void;
}

export default function EditFolder({
  name,
  id,
  setFolderName,
  onToggleEdit,
  onUpdateFolders
}: EditFolderProps) {
  const [error, setError] = useState<string | null>(null);

  const formSchema = yup.object().shape({
    name: yup.string().required('Please enter a folder name')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: name
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      fetch(`/api/folders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      }).then((r) => {
        if (r.ok) {
          r.json().then((updatedFolder: Folder) => {
            setFolderName(updatedFolder.name);
            if (onUpdateFolders) {
              onUpdateFolders(updatedFolder); // Updated to pass just the folder
            }
            formik.resetForm();
            onToggleEdit();
            // toast.dark('Recipient added succesfully');
          });
        } else {
          r.json().then((error: { message: string }) => setError(error.message));
          // setLoading(false)
        }
      });
    }
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="relative flex items-center">
        <input
          value={formik.values.name}
          onChange={formik.handleChange}
          id="name"
          name="name"
          className="w-full px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        <div className="absolute right-0 flex space-x-1 mr-1">
          <button
            type="button"
            onClick={onToggleEdit}
            className="p-1 text-teal-600 hover:text-teal-700 transition-colors"
          >
            <X size={16} />
          </button>
          <button type="submit" className="p-1 text-teal-600 hover:text-teal-700 transition-colors">
            <Check size={16} />
          </button>
        </div>
      </div>
      {formik.errors.name && <p className="text-xs text-red-500 text-left mt-1">{formik.errors.name}</p>}
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
    </form>
  );
}
