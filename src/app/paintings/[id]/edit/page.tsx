'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import UploadWidget from '@/components/UploadWidget';
import type { Painting, Folder } from '@/lib/types';

export default function EditPaintingPage({ params }: { params: Promise<{ id: number }> }) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [painting, setPainting] = useState<Painting>({} as Painting);
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

  useEffect(() => {
    if (id) {
      fetch(`/api/paintings/${id}`)
        .then((res) => res.json())
        .then((painting: Painting) => {
          setPainting(painting);
          setImageUrl(painting.image || '');
        });
    }
  }, [id]);

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
    folder_id: yup.number().required('Please select a value'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: painting.title || '',
      materials: painting.materials || '',
      width: painting.width || '',
      height: painting.height || '',
      sale_price: painting.sale_price || '',
      image: imageUrl,
      sold: painting.sold ? 'true' : 'false',
      folder_id: painting.folder_id || '',
    },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      try {
        const res = await fetch(`/api/paintings/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (res.ok) {
          const painting = await res.json();
          router.push(`/paintings/${id}`);
        } else {
          const error = await res.json();
          setError(error.message);
        }
      } catch (err) {
        setError('An error occurred while updating the painting');
      }
    },
  });

  if (isLoading) return <div className="text-center">Loading folders...</div>;
  if (folderError) return <div className="text-center text-red-500">{folderError}</div>;

  return (
    <>
      {error && <h2 className="text-center text-red-500">{error}</h2>}
      <div className="container mx-auto min-h-screen max-w-2xl px-4 mt-16 mb-6">
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          <div className="flex items-center justify-center border-b border-border pb-4">
            <h4 className="text-center text-2xl font-medium text-foreground">Edit Painting</h4>
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between text-foreground">
              <span>Upload image, then enter painting info...</span>
              <Link href={`/paintings/${id}`} className="flex items-center text-blue-600 hover:text-blue-800">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Painting
              </Link>
            </label>

            <UploadWidget onSetImageUrl={setImageUrl} />

            {imageUrl && (
              <div className="relative h-64 w-full">
                <Image src={imageUrl} alt="Painting preview" fill className="rounded-md object-contain" />
              </div>
            )}

            <input type="hidden" name="image" value={formik.values.image} onChange={formik.handleChange} />
            {formik.errors.image && <p className="text-center text-red-500">{formik.errors.image}</p>}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Title</label>
              <input
                type="text"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                placeholder="Title..."
                className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
              />
              {formik.errors.title && <p className="text-center text-red-500">{formik.errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Materials</label>
              <input
                type="text"
                name="materials"
                value={formik.values.materials}
                onChange={formik.handleChange}
                placeholder="Materials..."
                className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
              />
              {formik.errors.materials && (
                <p className="text-center text-red-500">{formik.errors.materials}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground">Width</label>
                <input
                  type="text"
                  name="width"
                  value={formik.values.width}
                  onChange={formik.handleChange}
                  placeholder="Width in inches..."
                  className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
                />
                {formik.errors.width && <p className="text-center text-red-500">{formik.errors.width}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">Height</label>
                <input
                  type="text"
                  name="height"
                  value={formik.values.height}
                  onChange={formik.handleChange}
                  placeholder="Height in inches..."
                  className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
                />
                {formik.errors.height && <p className="text-center text-red-500">{formik.errors.height}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Price</label>
              <input
                type="text"
                name="sale_price"
                value={formik.values.sale_price}
                onChange={formik.handleChange}
                placeholder="Price..."
                className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
              />
              {formik.errors.sale_price && (
                <p className="text-center text-red-500">{formik.errors.sale_price}</p>
              )}
            </div>

            <div>
              <select
                name="sold"
                onChange={formik.handleChange}
                value={formik.values.sold}
                className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
              >
                <option value="false">For Sale</option>
                <option value="true">Sold</option>
              </select>
              {formik.errors.sold && <p className="text-center text-red-500">{formik.errors.sold}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Folder</label>
              <select
                name="folder_id"
                onChange={formik.handleChange}
                value={formik.values.folder_id}
                className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
              >
                {folderList}
              </select>
              {formik.errors.folder_id && (
                <p className="text-center text-red-500">{formik.errors.folder_id}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
