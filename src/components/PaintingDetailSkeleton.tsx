export default function PaintingDetailSkeleton() {
  return (
    <div className="flex justify-center w-full min-h-screen animate-pulse">
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="mt-8 rounded-lg shadow-lg bg-[var(--background-secondary)] opacity-50">
          <div className="flex flex-col md:flex-row">
            {/* Image skeleton */}
            <div className="relative w-full md:w-2/3">
              <div className="w-full" style={{ aspectRatio: '960/600' }}>
                <div className="w-full h-full bg-[var(--muted)] animate-pulse rounded-tl-lg rounded-tr-lg md:rounded-tr-none md:rounded-bl-lg" />
              </div>
            </div>

            {/* Content skeleton */}
            <div className="p-6 md:w-1/3">
              {/* Title and details skeleton */}
              <div className="mt-4 space-y-3">
                <div className="h-8 bg-[var(--muted)] animate-pulse rounded w-3/4" />
                <div className="h-5 bg-[var(--muted)] animate-pulse rounded w-1/2" />
                <div className="h-5 bg-[var(--muted)] animate-pulse rounded w-1/3" />
                <div className="h-6 bg-[var(--muted)] animate-pulse rounded w-1/4" />
              </div>

              {/* Navigation buttons skeleton */}
              <div className="flex gap-2 mt-4 pb-3 border-b border-[var(--border)]">
                <div className="w-12 h-12 bg-[var(--muted)] animate-pulse rounded-full" />
                <div className="w-12 h-12 bg-[var(--muted)] animate-pulse rounded-full" />
                <div className="w-12 h-12 bg-[var(--muted)] animate-pulse rounded-full" />
              </div>

              {/* Action buttons skeleton */}
              <div className="flex gap-2 mt-3">
                <div className="w-12 h-12 bg-[var(--muted)] animate-pulse rounded-full" />
                <div className="w-12 h-12 bg-[var(--muted)] animate-pulse rounded-full" />
              </div>

              {/* Admin controls skeleton */}
              <div className="mt-4">
                <div className="flex items-center gap-4">
                  <div className="w-32 h-10 bg-[var(--muted)] animate-pulse rounded-full" />
                  <div className="flex-1 max-w-52 h-10 bg-[var(--muted)] animate-pulse rounded" />
                </div>
              </div>

              {/* Comment form skeleton */}
              <div className="mt-4">
                <div className="bg-[var(--background-secondary)] rounded-lg p-6 shadow-lg border border-[var(--card-border)]">
                  <div className="h-20 bg-[var(--muted)] animate-pulse rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments section skeleton */}
        <div className="mt-8">
          <div className="bg-[var(--background-secondary)] rounded-lg shadow p-4">
            <div className="space-y-4">
              <div className="h-16 bg-[var(--muted)] animate-pulse rounded" />
              <div className="h-16 bg-[var(--muted)] animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}