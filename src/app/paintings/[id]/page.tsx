import PaintingDetail from '@/components/PaintingDetail';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const id = Number(resolvedParams.id);

  if (!id) {
    notFound();
  }

  return <PaintingDetail paintingId={id} />;
}
