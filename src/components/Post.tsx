import { FC } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Post as PostType } from '@/lib/types';
import VideoPlayer from '@/components/VideoPlayer';
import FormattedContent from '@/components/FormattedContent';
import DateFormat from '@/components/DateFormat';
import Image from 'next/image';

interface PostProps extends Partial<PostType> {
  isAdmin?: boolean;
}

const Post: FC<PostProps> = ({ id, title, content, image_url, video_url, date_added }) => {
  return (
    <div className="w-full max-w-3xl bg-white rounded-lg shadow-md overflow-hidden">
      {image_url !== 'undefined' && image_url !== null && image_url !== 'null' && (
        <div className="aspect-w-16 aspect-h-9">
          <Image
            className="object-cover w-full h-full"
            src={image_url || ''}
            alt={title || 'Post image'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />{' '}
        </div>
      )}

      {video_url !== 'undefined' && video_url !== null && video_url !== 'null' && (
        <div className="aspect-w-16 aspect-h-9">{video_url && <VideoPlayer videoUrl={video_url} />}</div>
      )}

      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <DateFormat date={date_added} />
        <div className="mt-4">
          <FormattedContent content={content || ''} />
        </div>
        <div className="mt-6">
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
    </div>
  );
};

export default Post;
