// components/InstagramButton.tsx
import Image from 'next/image';

interface InstagramButtonProps {
  onClick: () => void;
}

const InstagramButton: React.FC<InstagramButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-4 px-6 py-3 bg-[var(--button-background)] border border-[var(--button-border)] text-[var(--text-primary)] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
  >
    <div className="flex items-center justify-center w-6 h-6">
      <Image
        src="/instagram.svg"
        alt="Instagram Logo"
        width={24}
        height={24}
        className="w-full h-full"
      />
    </div>
    <span className="text-base font-semibold tracking-wider">Instagram</span>
  </button>
);

export default InstagramButton;
