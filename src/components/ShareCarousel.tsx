// components/ShareCarousel.tsx
'use client';

import { useState } from 'react';
import { Image } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { PrimaryIconButton } from './buttons/PrimaryIconButton';

interface ShareCarouselProps {
  imageUrl: string;
  caption: string;
}

export function ShareCarousel({ imageUrl, caption }: ShareCarouselProps) {
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

  const shareToCarousel = async () => {
    try {
      setIsSharing(true);
      const freshToken = await getFreshToken();

      const shareResponse = await fetch('/api/instagram/share-carousel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaUrls: [imageUrl],
          caption,
          accessToken: freshToken,
        }),
        // Add timeout handling
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      // Handle non-JSON responses
      const responseText = await shareResponse.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error('Invalid JSON response:', e + responseText);
        throw new Error('Server returned invalid response');
      }

      if (!shareResponse.ok) {
        throw new Error(responseData.error || `Failed to share (${shareResponse.status})`);
      }

      toast.success('Successfully shared to Instagram Feed');
    } catch (error) {
      console.error('Sharing error:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        toast.error('Request timed out - please try again');
      } else {
        toast.error(error instanceof Error ? error.message : 'Failed to share to feed');
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <PrimaryIconButton
      onClick={shareToCarousel}
      icon={Image}
      disabled={isSharing}
      isLoading={isSharing}
      label={isSharing ? 'Sharing...' : 'Share to Instagram Feed'}
    />
  );
}
