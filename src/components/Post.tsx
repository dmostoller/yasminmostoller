// Post.tsx
import { FC } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Post as PostType } from '@/lib/types';
import VideoPlayer from '@/components/VideoPlayer';
import FormattedContent from '@/components/FormattedContent';
import DateFormat from '@/components/DateFormat';
import Image from 'next/image';

const Post: FC<PostType> = ({ id, title, content, image_url, video_url, date_added }) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-lg">
      {/* Media Section */}
      {image_url !== 'undefined' && image_url !== null && image_url !== 'null' && (
        <div className="relative w-full h-0" style={{ paddingBottom: '100%' }}>
          <Image
            className="absolute inset-0 object-cover w-full h-full"
            src={image_url || ''}
            alt={title || 'Post image'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {video_url !== 'undefined' && video_url !== null && video_url !== 'null' && (
        <div className="w-full">{video_url && <VideoPlayer videoUrl={video_url} />}</div>
      )}

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-6">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <DateFormat date={date_added} />
        <div className="mt-4 flex-grow">
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
