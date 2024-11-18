import { FC } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Post as PostType } from '@/lib/types';
import VideoPlayer from '@/components/VideoPlayer';

interface PostProps extends Partial<PostType> {
  isAdmin?: boolean;
}

const Post: FC<PostProps> = ({ id, title, content, image_url, video_url, date_added }) => {
  return (
    <div className="w-full max-w-3xl bg-white rounded-lg shadow-md overflow-hidden">
      {image_url !== 'undefined' && image_url !== null && image_url !== 'null' && (
        <div className="aspect-w-16 aspect-h-9">
          <img className="object-cover w-full h-full" src={image_url} alt={title || 'Post image'} />
        </div>
      )}

      {video_url !== 'undefined' && video_url !== null && video_url !== 'null' && (
        <div className="aspect-w-16 aspect-h-9">{video_url && <VideoPlayer videoUrl={video_url} />}</div>
      )}

      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <div className="text-sm text-gray-500 mt-1">{date_added}</div>
        <p className="mt-4 text-gray-600">{content}</p>
        <div className="mt-6">
          <Link
            href={`/posts/${id}`}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-transparent border border-teal-500 text-teal-500 hover:bg-teal-50 transition-colors"
          >
            <ExternalLink className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Post;
