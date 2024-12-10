import { FC, useEffect, useRef } from 'react';
import '../../node_modules/cloudinary-video-player/dist/cld-video-player.min.css';

// Remove the conflicting import
// import { Cloudinary } from 'cloudinary-video-player';

type CloudinaryVideoPlayer = {
  source: (url: string) => void;
  dispose: () => void;
};

type CloudinaryVideoPlayerOptions = {
  cloud_name: string;
  controls: boolean;
  fluid: boolean;
};

// Update global interface with a namespace
declare global {
  interface Window {
    // Use a namespace to avoid conflicts
    cloudinary: {
      createVideoPlayer(
        element: HTMLVideoElement,
        options: CloudinaryVideoPlayerOptions
      ): CloudinaryVideoPlayer;
    };
  }
}

interface VideoPlayerProps {
  videoUrl: string;
  cloudName?: string;
}

const VideoPlayer: FC<VideoPlayerProps> = ({ videoUrl, cloudName = 'ddp2xfpyb' }) => {
  const playerRef = useRef<CloudinaryVideoPlayer | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/cloudinary-video-player@1.9.0/dist/cld-video-player.min.js';
    script.async = true;

    script.onload = () => {
      try {
        const cld = window.cloudinary.createVideoPlayer(videoRef.current as HTMLVideoElement, {
          cloud_name: cloudName,
          controls: true,
          fluid: true,
        });

        playerRef.current = cld;
        cld.source(videoUrl);
      } catch (error) {
        console.error('Failed to initialize video player:', error);
      }
    };

    document.body.appendChild(script);

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.dispose();
        } catch (error) {
          console.error('Error disposing player:', error);
        }
      }
      document.body.removeChild(script);
    };
  }, [videoUrl, cloudName]);

  return (
    <div className="w-full h-full">
      <video ref={videoRef} className="w-full h-full object-cover cld-video-player" />
    </div>
  );
};

export default VideoPlayer;
