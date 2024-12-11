'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ArrowLeft } from 'lucide-react';
import UploadWidget from '@/components/UploadWidget';
import type { Folder, Painting } from '@/lib/types';
import { CldImage } from 'next-cloudinary';
import { useCreatePainting } from '@/hooks/usePaintings';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
interface PaintingFormValues {
  title: string;
  materials: string;
  width: string; // string for form input
  height: string; // string for form input
  sale_price: string; // string for form input
  image: string;
  sold: string; // string for select input
  folder_id: string; // string for select input
}

export default function NewPaintingPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [folderError, setFolderError] = useState<string | null>(null);
  const createPainting = useCreatePainting();

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
        setFolderError('Error loading folders' + err);
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
    folder_id: yup.number().required('Please select a value'),
  });

  const formik = useFormik<PaintingFormValues>({
    enableReinitialize: true,
    initialValues: {
      title: '',
      materials: '',
      width: '',
      height: '',
      sale_price: '',
      image: imageUrl,
      sold: 'false',
      folder_id: '',
    },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      try {
        const paintingData: Omit<Painting, 'id'> = {
          title: values.title,
          materials: values.materials,
          width: Number(values.width),
          height: Number(values.height),
          sale_price: Number(values.sale_price),
          image: values.image,
          sold: values.sold === 'true',
          folder_id: Number(values.folder_id),
        };
        await createPainting.mutateAsync(paintingData);
        router.push('/paintings');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    },
  });

  if (isLoading) return <div className="text-center">Loading folders...</div>;
  if (folderError) return <div className="text-center text-red-500">{folderError}</div>;

  return (
    <>
      {error && <h2 className="text-center text-red-500">{error}</h2>}
      <div className="container mx-auto min-h-screen max-w-5xl px-4 mt-16 mb-6">
        <div className="flex items-center justify-center border-b border-border pb-4">
          <h4 className="text-center text-2xl font-medium text-foreground">Add New Painting</h4>
        </div>
        <label className="flex items-center justify-between text-foreground py-2 mb-2">
          <span>Upload image, then enter painting info...</span>
          <Link href="/paintings" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Paintings Page
          </Link>
        </label>
        <form
          className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8"
          onSubmit={formik.handleSubmit}
        >
          {/* Left Column - Image Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              {imageUrl && (
                <div className="relative h-64 w-full lg:h-max">
                  <CldImage
                    src={imageUrl}
                    alt="Painting preview"
                    width={800}
                    height={600}
                    className="rounded-md object-contain w-full h-full"
                  />
                </div>
              )}
              <UploadWidget onSetImageUrl={setImageUrl} />
              <input type="hidden" name="image" value={formik.values.image} onChange={formik.handleChange} />
              {formik.errors.image && <p className="text-center text-red-500">{formik.errors.image}</p>}
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Title</label>
              <input
                type="text"
                name="title"
                value={formik.values.title}
                placeholder="Title..."
                onChange={formik.handleChange}
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
                placeholder="Materials..."
                onChange={formik.handleChange}
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
                  placeholder="Width in inches..."
                  onChange={formik.handleChange}
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
                  placeholder="Height in inches..."
                  onChange={formik.handleChange}
                  className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
                />
                {formik.errors.height && <p className="text-center text-red-500">{formik.errors.height}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Sale Price</label>
              <input
                type="text"
                name="sale_price"
                value={formik.values.sale_price}
                placeholder="Price..."
                onChange={formik.handleChange}
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
            <PrimaryButton
              type="submit"
              text="Submit"
              className="w-full"
              disabled={formik.isSubmitting}
              isLoading={formik.isSubmitting}
            />
          </div>
        </form>
      </div>
    </>
  );
}
