// components/ShareStory.tsx
'use client';

import { useState } from 'react';
import { Instagram } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { PrimaryIconButton } from './buttons/PrimaryIconButton';

interface ShareStoryProps {
  imageUrl: string;
  caption: string;
}

export function StoryShare({ imageUrl, caption }: ShareStoryProps) {
  const [isSharing, setIsSharing] = useState(false);

  const getFreshToken = async () => {
    try {
      const response = await fetch('/api/instagram/get-fresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to get fresh token');
      }

      const { accessToken } = await response.json();
      return accessToken;
    } catch (error) {
      console.error('Token error:', error);
      throw new Error('Could not get Instagram access token');
    }
  };

  const shareToStory = async () => {
    try {
      setIsSharing(true);

      // Get fresh token first
      const freshToken = await getFreshToken();

      // Share story with fresh token

      const shareResponse = await fetch('/api/instagram/share-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaUrl: imageUrl,
          caption,
          accessToken: freshToken,
          stickerConfig: {
            text: caption,
            // Position near bottom of story for better visibility
            x_position: 0.5,
            y_position: 0.8,
            width: 0.6,
            height: 0.1,
            // Add styling properties
            background_color: '#000000',
            text_color: '#FFFFFF',
            font_size: 24,
            alignment: 'center',
            text_opacity: 1.0,
          },
        }),
      });

      if (!shareResponse.ok) {
        const errorData = await shareResponse.json();
        throw new Error(errorData.error || 'Failed to share story');
      }

      toast.success('Successfully shared to Instagram Story');
    } catch (error) {
      console.error('Sharing error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to share story');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <PrimaryIconButton
      onClick={shareToStory}
      icon={Instagram}
      disabled={isSharing}
      label={isSharing ? 'Sharing...' : 'Share to Instagram Story'}
    />
  );
}
