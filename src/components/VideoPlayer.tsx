import { FC, useEffect, useRef } from 'react';
import '../../node_modules/cloudinary-video-player/dist/cld-video-player.min.css';
import { Cloudinary } from 'cloudinary-video-player';

// Update global interface
declare global {
  interface Window {
    cloudinary: Cloudinary;
  }
}

interface VideoPlayerProps {
  videoUrl: string;
  cloudName?: string;
}

const VideoPlayer: FC<VideoPlayerProps> = ({ videoUrl, cloudName = 'ddp2xfpyb' }) => {
  const playerRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Load Cloudinary script dynamically
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/cloudinary-video-player@1.9.0/dist/cld-video-player.min.js';
    script.async = true;

    script.onload = () => {
      if (!videoRef.current) return;

      try {
        // Initialize player after script loads
        const cld = (window.cloudinary as any).videoPlayer(videoRef.current, {
          cloud_name: cloudName,
          controls: true,
          fluid: true
        });

        playerRef.current = cld;
        cld.source(videoUrl);
      } catch (error) {
        console.error('Failed to initialize video player:', error);
      }
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup
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
