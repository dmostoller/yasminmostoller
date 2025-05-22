# Instagram Access Token Refresh Guide

This guide explains how to generate a new Instagram access token when the current token expires.

## When to Refresh

Instagram access tokens expire after 60 days. If you see errors like:

- "Session has expired"
- "Error validating access token"
- HTTP 500 errors when sharing to Instagram

You need to generate a new token.

## Steps to Generate New Token

### 1. Access Facebook Developers Console

1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Log in with the Facebook account that owns the app

### 2. Navigate to Your App

1. Select your app from the dashboard (should be named something like "Yasmin Mostoller Art" or
   similar)
2. In the left sidebar, look for **Instagram** section
3. Click on **API setup with Instagram Login** or **Instagram Basic Display**

### 3. Generate Access Token

1. Find the **User Token Generator** section
2. Select the Instagram account: **yasminnunsy**
3. Click **Generate Token**
4. You may need to re-authorize the app if prompted
5. Copy the newly generated access token (it will be a long string starting with "IGAA...")

### 4. Update Environment Variable

1. Open your `.env` file in the project root
2. Find the line with `INSTAGRAM_ACCESS_TOKEN=`
3. Replace the old token with the new one:
   ```
   INSTAGRAM_ACCESS_TOKEN=your_new_token_here
   ```
4. Save the file

### 5. Restart Development Server

If running locally, restart your development server:

```bash
npm run dev
```

### 6. Deploy Changes (Production)

For production environments:

1. Update the `INSTAGRAM_ACCESS_TOKEN` in your hosting platform (Vercel, etc.)
2. Redeploy the application

## Verification

To verify the new token is working:

1. Visit `/api/instagram/diagnose` in your browser
2. Check that `tokenStatus.valid` is `true`
3. Test the Instagram sharing functionality

## Important Notes

- Instagram tokens can only be refreshed within 60 days of generation
- After 60 days, you must generate a completely new token
- The token is tied to the specific Instagram account (yasminnunsy)
- Keep the token secure and never commit it to public repositories

## Troubleshooting

If the token generation fails:

1. Ensure the Instagram account is still connected to a Facebook Page
2. Check that the app hasn't been suspended in Meta Developer Console
3. Verify the app still has `instagram_content_publish` permission
4. Try logging out and back into both Facebook and Instagram

## Token Lifespan

- Short-lived tokens: Valid for 1 hour
- Long-lived tokens: Valid for 60 days
- The app automatically exchanges short-lived tokens for long-lived ones

Last updated: May 2025
