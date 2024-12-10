import PaintingDetail from '@/components/PaintingDetail';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const id = Number(resolvedParams.id);

  return <PaintingDetail paintingId={id} />;
}
