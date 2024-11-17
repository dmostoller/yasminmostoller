// components/PaintingSkeleton.tsx
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function PaintingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array(6)
        .fill(0)
        .map((_, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-md p-4">
            <Skeleton height={200} />
            <Skeleton height={24} width={150} className="mt-4" />
            <Skeleton height={20} width={100} className="mt-2" />
            <div className="mt-4">
              <Skeleton height={36} width={120} />
            </div>
          </div>
        ))}
    </div>
  );
}
