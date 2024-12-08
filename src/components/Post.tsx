// Post.tsx
import { FC } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Post as PostType } from '@/lib/types';
import FormattedContent from '@/components/FormattedContent';
import DateFormat from '@/components/DateFormat';
import { CldImage } from 'next-cloudinary';
import { CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';

const Post: FC<PostType> = ({ id, title, content, image_url, video_url, date_added, isAdmin }) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-[var(--card-border)] bg-[var(--background-secondary)] shadow-sm transition-all duration-200 hover:shadow-lg">
      {/* Media Section */}
      {image_url !== 'undefined' && image_url !== null && image_url !== 'null' && (
        <div>
          <CldImage
            width="960"
            height="600"
            src={image_url || ''}
            alt={title || 'Post image'}
            sizes="100vw"
          />
        </div>
      )}

      {video_url !== 'undefined' && video_url !== undefined && video_url !== null && video_url !== 'null' && (
        <div>
          <CldVideoPlayer width="1080" height="1920" src={video_url} />
        </div>
      )}

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">{title}</h2>
        <DateFormat date={date_added} />
        <div className="mt-4 flex-grow text-[var(--text-secondary)]">
          <FormattedContent content={content || ''} />
        </div>
        <div className="mt-6">
          <Link
            href={`/news/${id}`}
            className="inline-flex items-center justify-center px-4 h-10 rounded-full bg-transparent border border-teal-500 text-teal-500 hover:bg-teal-50 transition-colors gap-2"
          >
            <span>Go to Post</span>
            <ExternalLink className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Post;
