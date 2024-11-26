'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ArrowLeft } from 'lucide-react';
import UploadWidget from '@/components/UploadWidget';
import type { Folder, Painting } from '@/lib/types';

export default function NewPaintingPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [folderError, setFolderError] = useState<string | null>(null);

  useEffect(() => {
    const getFolders = async () => {
      try {
        const res = await fetch('/api/folders');
        if (res.ok) {
          const data = await res.json();
          setFolders(data);
        } else {
          setFolderError('Failed to load folders');
        }
      } catch (err) {
        setFolderError('Error loading folders');
      } finally {
        setIsLoading(false);
      }
    };

    getFolders();
  }, []);

  const folderList = folders.map((folder: Folder) => (
    <option key={folder.id} value={folder.id}>
      {folder.name}
    </option>
  ));

  const formSchema = yup.object().shape({
    title: yup.string().required('Please enter a title'),
    materials: yup.string().required('Please enter materials used'),
    width: yup
      .number()
      .integer()
      .required('Please enter a width')
      .min(0, 'Width cannot be a negative number'),
    height: yup
      .number()
      .integer()
      .required('Please enter a height')
      .min(0, 'Height cannot be a negative number'),
    sale_price: yup.string().required('Please enter an price'),
    image: yup.string().required('Please enter an image link'),
    sold: yup.string().required('Please select a value'),
    folder_id: yup.number().required('Please select a value')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: '',
      materials: '',
      width: '',
      height: '',
      sale_price: '',
      image: imageUrl,
      sold: '',
      folder_id: ''
    },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      try {
        const res = await fetch('/api/paintings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });

        if (res.ok) {
          const painting: Painting = await res.json();
          router.push('/paintings');
        } else {
          const data = await res.json();
          setError(data.message);
        }
      } catch (err) {
        setError('An error occurred while submitting');
      }
    }
  });

  if (isLoading) return <div className="text-center">Loading folders...</div>;
  if (folderError) return <div className="text-center text-red-500">{folderError}</div>;

  return (
    <>
      {error && <h2 className="text-center text-red-500">{error}</h2>}
      <div className="container mx-auto min-h-screen max-w-2xl px-4 mt-12 mb-6">
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          <div className="border-b border-gray-200 py-4">
            <h4 className="text-center text-2xl font-medium">Add New Painting</h4>
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between">
              <span>Upload image then enter painting info...</span>
              <Link href="/paintings" className="flex items-center text-blue-600 hover:text-blue-800">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Paintings Page
              </Link>
            </label>

            <UploadWidget onSetImageUrl={setImageUrl} />

            {imageUrl && <img src={imageUrl} alt="Uploaded painting" className="mx-auto mt-2 rounded-md" />}

            <input
              type="text"
              className="hidden"
              name="image"
              value={formik.values.image}
              onChange={formik.handleChange}
            />
            {formik.errors.image && <p className="text-center text-red-500">{formik.errors.image}</p>}
          </div>

          <div className="space-y-2">
            <label className="block">Title</label>
            <input
              type="text"
              name="title"
              value={formik.values.title}
              placeholder="Title..."
              onChange={formik.handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
            {formik.errors.title && <p className="text-center text-red-500">{formik.errors.title}</p>}
          </div>

          <div className="space-y-2">
            <label className="block">Materials</label>
            <input
              type="text"
              name="materials"
              value={formik.values.materials}
              placeholder="Materials..."
              onChange={formik.handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
            {formik.errors.materials && <p className="text-center text-red-500">{formik.errors.materials}</p>}
          </div>

          <div className="space-y-2">
            <label className="block">Width</label>
            <input
              type="text"
              name="width"
              value={formik.values.width}
              placeholder="Width in inches..."
              onChange={formik.handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
            {formik.errors.width && <p className="text-center text-red-500">{formik.errors.width}</p>}
          </div>

          <div className="space-y-2">
            <label className="block">Height</label>
            <input
              type="text"
              name="height"
              value={formik.values.height}
              placeholder="Height in inches..."
              onChange={formik.handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
            {formik.errors.height && <p className="text-center text-red-500">{formik.errors.height}</p>}
          </div>

          <div className="space-y-2">
            <label className="block">Sale Price</label>
            <input
              type="text"
              name="sale_price"
              value={formik.values.sale_price}
              placeholder="Price..."
              onChange={formik.handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
            {formik.errors.sale_price && (
              <p className="text-center text-red-500">{formik.errors.sale_price}</p>
            )}
          </div>

          <div className="space-y-2">
            <select
              name="sold"
              onChange={formik.handleChange}
              value={formik.values.sold}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="false">For Sale</option>
              <option value="true">Sold</option>
            </select>
            {formik.errors.sold && <p className="text-center text-red-500">{formik.errors.sold}</p>}
          </div>

          <div className="space-y-2">
            <label className="block">Folder</label>
            <select
              name="folder_id"
              onChange={formik.handleChange}
              value={formik.values.folder_id}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              {folderList}
            </select>
            {formik.errors.folder_id && <p className="text-center text-red-500">{formik.errors.folder_id}</p>}
          </div>

          <button type="submit" className="w-full rounded-full bg-teal-500 py-2 text-white hover:bg-teal-600">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
