import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-6 px-4 text-center bg-[var(--background)] border-t border-[var(--card-border)]">
      <div className="space-y-2">
        <p>
          <span className="text-sm text-[var(--text-secondary)]">© Yasmin Mostoller 2024</span>
        </p>
        <div className="flex justify-center gap-4 text-sm">
          <Link
            href="/privacy"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Terms & Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}
