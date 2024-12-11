import axios from 'axios';

export class InstagramAuth {
  private static readonly BASE_URL = 'https://www.instagram.com';
  private static readonly GRAPH_URL = 'https://graph.instagram.com';

  static getAuthorizationUrl() {
    const scopes = [
      'public_profile',
      'instagram_manage_messages',
      'instagram_manage_comments',
      'instagram_content_publish',
      'pages_show_list',
    ];

    return (
      `${InstagramAuth.BASE_URL}/oauth/authorize?` +
      new URLSearchParams({
        enable_fb_login: '0',
        force_authentication: '1',
        client_id: process.env.INSTAGRAM_APP_ID!,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/instagram`,
        response_type: 'code',
        scope: scopes.join(','),
      }).toString()
    );
  }

  static async getLongLivedToken(shortLivedToken: string) {
    try {
      if (!shortLivedToken) {
        throw new Error('Short-lived token is required');
      }

      console.log('Attempting to exchange token:', shortLivedToken.substring(0, 10) + '...');

      const response = await axios.get('https://graph.instagram.com/access_token', {
        params: {
          grant_type: 'ig_exchange_token',
          client_secret: process.env.INSTAGRAM_APP_SECRET,
          access_token: shortLivedToken,
        },
      });

      if (!response.data?.access_token) {
        throw new Error('No access token in response');
      }

      return response.data.access_token;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Token exchange error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
      }
      throw error;
    }
  }

  static async exchangeCodeForToken(code: string) {
    try {
      const formData = new URLSearchParams({
        client_id: process.env.INSTAGRAM_APP_ID!,
        client_secret: process.env.INSTAGRAM_APP_SECRET!,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/instagram`,
        code,
      });

      const response = await axios.post(`${InstagramAuth.BASE_URL}/oauth/access_token`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      // Exchange short-lived token for long-lived token
      const longLivedToken = await this.getLongLivedToken(response.data.access_token);
      return longLivedToken;
    } catch (error) {
      console.error('Instagram token exchange error:', error);
      throw error;
    }
  }

  static async shareToStory(accessToken: string, mediaUrl: string, caption: string) {
    try {
      // First, get the user's Instagram Business Account ID
      const userResponse = await axios.get(`${this.GRAPH_URL}/me`, {
        params: {
          fields: 'id,username',
          access_token: accessToken,
        },
      });

      const userId = userResponse.data.id;

      // Create the story container with sticker if provided
      const createMediaResponse = await axios.post(
        `${this.GRAPH_URL}/${userId}/media`,
        {
          image_url: mediaUrl,
          caption,
          media_type: 'STORIES',
        },
        {
          params: { access_token: accessToken },
        }
      );

      const creationId = createMediaResponse.data.id;

      // Publish the story
      const publishResponse = await axios.post(
        `${this.GRAPH_URL}/${userId}/media_publish`,
        {
          creation_id: creationId,
        },
        {
          params: { access_token: accessToken },
        }
      );

      return publishResponse.data;
    } catch (error) {
      console.error('Instagram story sharing error:', error);
      throw error;
    }
  }

  // app/api/instagram/utils.ts
  static async shareCarousel(accessToken: string, containerIds: string[], caption: string) {
    try {
      // Get user ID
      const userResponse = await axios.get(`${this.GRAPH_URL}/me`, {
        params: {
          fields: 'id',
          access_token: accessToken,
        },
      });

      const userId = userResponse.data.id;

      // Create carousel container with child media IDs
      const carouselResponse = await axios.post(
        `${this.GRAPH_URL}/${userId}/media`,
        {
          media_type: 'CAROUSEL',
          children: containerIds,
          caption: caption,
        },
        {
          params: { access_token: accessToken },
        }
      );

      console.log('Carousel container created:', carouselResponse.data);

      // Publish the carousel
      const publishResponse = await axios.post(
        `${this.GRAPH_URL}/${userId}/media_publish`,
        {
          creation_id: carouselResponse.data.id,
        },
        {
          params: { access_token: accessToken },
        }
      );

      return publishResponse.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to share carousel:', error.response?.data || error);
      } else {
        console.error('Failed to share carousel:', error);
      }
      throw error;
    }
  }

  static async createMediaContainer(accessToken: string, mediaUrl: string, mediaType: 'IMAGE' | 'REELS') {
    try {
      // Get user ID first
      const userResponse = await axios.get(`${this.GRAPH_URL}/me`, {
        params: {
          fields: 'id',
          access_token: accessToken,
        },
      });

      const userId = userResponse.data.id;

      // Create media container
      const response = await axios.post(
        `${this.GRAPH_URL}/${userId}/media`,
        {
          [mediaType === 'IMAGE' ? 'image_url' : 'video_url']: mediaUrl,
          media_type: mediaType,
          sharing_type: mediaType === 'REELS' ? 'REELS' : undefined,
        },
        {
          params: { access_token: accessToken },
        }
      );

      console.log('Created media container:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to create media container:', error.response?.data || error);
      } else {
        console.error('Failed to create media container:', error);
      }
      throw error;
    }
  }
}
