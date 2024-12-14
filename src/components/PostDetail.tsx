// components/PostDetail.tsx
'use client';
import { useRouter } from 'next/navigation';
import { Undo2, Edit, Trash2, Facebook } from 'lucide-react';
import { Bluesky } from './icons/Bluesky';
import { useSession } from 'next-auth/react';
import PostCommentsList from '@/components/PostCommentList';
import FormattedContent from '@/components/FormattedContent';
import DateFormat from '@/components/DateFormat';
import { CldImage } from 'next-cloudinary';
import { CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';
import { PrimaryIconButton } from './buttons/PrimaryIconButton';
import { SecondaryIconButton } from './buttons/SecondaryIconButton';
import { usePosts, useGetPost } from '@/hooks/usePosts';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { Toaster } from 'react-hot-toast';
import { FacebookShareButton } from 'react-share';
import { StoryShare } from './ShareStory';
import { ShareCarousel } from './ShareCarousel';
import { SecondaryIconButtonFB } from './buttons/SecondaryIconButtonFB';
import PostCommentForm from './PostCommentForm';
import { SecondaryButton } from './buttons/SecondaryButton';

interface PostDetailProps {
  postId: number;
}

const stripHtmlAndMarkdown = (html: string) => {
  // First remove HTML tags
  let text = html.replace(/<[^>]*>/g, '');
  // Remove Markdown headers, bold, italic, links etc
  text = text.replace(/[#*_\[\]()]/g, '');
  // Remove &nbsp; entities
  text = text.replace(/&nbsp;/g, ' ');
  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim();
  return text;
};

export default function PostDetail({ postId }: PostDetailProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.is_admin;
  const router = useRouter();
  const { data: post, isLoading, error } = useGetPost(postId);

  const videoUrl = post?.video_url;
  const { deletePost } = usePosts();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load post" />;
  if (!post) return <div>Post not found</div>;

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      if (post) {
        await deletePost.mutateAsync(post.id.toString());
      }
      router.push('/news');
    }
  };

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.yasminmostoller.com'}/news/${postId}`;

  const handleBlueSkyShare = () => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yasminmostoller.vercel.app';
    const shareUrl = `${baseUrl}/news/${postId}`;
    const text = `Check out "${post?.title}"\n\n${shareUrl}`;

    window.open(
      `https://bsky.app/intent/compose?text=${encodeURIComponent(text)}`,
      'bluesky-share-dialog',
      'width=800,height=600'
    );
  };

  return (
    <div className="container mx-auto min-h-screen px-4 mt-12">
      <Toaster position="top-center" />
      <div className="mx-auto max-w-7xl overflow-hidden rounded-lg shadow-md">
        <div className="md:flex">
          {/* Left column - Media */}
          <div className="md:w-3/4">
            {post.image_url !== 'undefined' &&
              post.image_url !== null &&
              post.image_url !== 'null' && (
                <div>
                  <CldImage
                    width="960"
                    height="600"
                    src={post.image_url || ''}
                    alt={post.title || 'Post image'}
                    sizes="100vw"
                  />
                </div>
              )}
            {videoUrl && videoUrl !== 'undefined' && videoUrl !== 'null' && (
              <div className="video-player-wrapper">
                <CldVideoPlayer
                  width="1080"
                  height="1920"
                  src={videoUrl}
                  colors={{
                    accent: '#ff0000',
                    base: '#000000',
                  }}
                  onError={(error: React.SyntheticEvent<HTMLVideoElement, Event>) => {
                    console.error('Video player error:', error);
                  }}
                />
              </div>
            )}
          </div>

          {/* Right column - Content */}
          <div className="p-6 md:w-1/2">
            <h2 className="mb-2 text-2xl font-bold text-[var(--text-primary)]">{post.title}</h2>
            <div className="mb-4 text-sm text-[var(--text-secondary)]">
              <DateFormat date={post.date_added} />
            </div>
            <div className="mb-6 text-[var(--text-primary)]">
              <FormattedContent content={post.content || ''} />
            </div>
            <div className="flex gap-2 pt-4">
              <SecondaryIconButton href="/news" icon={Undo2} label="Back to News" />
              <FacebookShareButton url={shareUrl} hashtag="#art">
                <SecondaryIconButtonFB icon={Facebook} label="Share on Facebook" />
              </FacebookShareButton>
              <SecondaryIconButton
                onClick={handleBlueSkyShare}
                icon={Bluesky}
                label="Share on BlueSky"
              />

              {session?.user && isAdmin && (
                <>
                  {post.image_url &&
                    post.image_url !== 'undefined' &&
                    post.image_url !== 'null' &&
                    (!videoUrl ||
                      videoUrl === 'undefined' ||
                      videoUrl === 'null' ||
                      videoUrl === '') && (
                      <>
                        <StoryShare
                          imageUrl={post.image_url}
                          caption={`${post.title} - ${post.content}`}
                        />
                        <ShareCarousel
                          imageUrl={post.image_url}
                          caption={`${post.title} - ${stripHtmlAndMarkdown(post.content || '')}`}
                        />
                      </>
                    )}
                  <PrimaryIconButton href={`/news/${post.id}/edit`} icon={Edit} />
                  <PrimaryIconButton onClick={handleDeletePost} icon={Trash2} />
                </>
              )}
            </div>
            <div className="mt-4">
              {session?.user ? (
                <div className="pb-6 pt-3 text-center">
                  <PostCommentForm user={session?.user} onAddComment={() => {}} postId={post.id} />
                </div>
              ) : (
                <div className="bg-[var(--background-secondary)] rounded-lg p-6 shadow-lg border border-[var(--card-border)] max-w-full md:max-w-xs">
                  <p className="text-center mb-4">Join the conversation</p>
                  <SecondaryButton
                    href="/api/auth/signin"
                    text="Sign In to Comment"
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 rounded-lg p-6 shadow-md">
        <PostCommentsList
          user={
            session?.user
              ? {
                  id: session.user.id,
                  username: session.user.name || '',
                  email: session.user.email,
                }
              : null
          }
          post_id={post.id}
        />
      </div>
    </div>
  );
}
