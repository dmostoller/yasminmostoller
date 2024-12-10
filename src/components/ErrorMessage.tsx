// components/ErrorMessage.tsx
'use client';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
  details?: string;
}

export default function ErrorMessage({
  message = 'An error occurred',
  details,
}: ErrorMessageProps) {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md mx-auto p-6 rounded-lg bg-[var(--background-secondary)] border border-[var(--border)]">
        <div className="flex justify-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-[var(--text-primary)]">{message}</h3>
        {details && <p className="text-[var(--text-secondary)] text-sm">{details}</p>}

        <button
          onClick={handleRetry}
          className="inline-flex items-center gap-2 px-4 py-2 mt-4 text-sm font-medium text-[var(--text-primary)] bg-[var(--background)] border border-[var(--border)] rounded-md hover:bg-[var(--background-secondary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--border)] transition-colors"
        >
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}
