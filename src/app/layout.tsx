import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ClientSessionProvider from '@/context/ClientSessionProvider';
import ClientQueryProvider from '@/context/ClientQueryProvider';
import Script from 'next/script';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Yasmin Mostoller | Abstract Artist',
  description: 'Imagination and Emotion',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/cloudinary-video-player/2.0.2/cld-video-player.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--background)] text-[var(--foreground)] max-h-[80vh]`}
      >
        <ClientQueryProvider>
          <ClientSessionProvider>
            <Nav />
            <main className="flex-grow pt-[72px] px-2">{children}</main>
            <SpeedInsights />
            <Analytics />
            <Footer />
          </ClientSessionProvider>
        </ClientQueryProvider>
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/cloudinary-video-player/2.0.2/cld-video-player.min.js"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
        <Script
          src="https://upload-widget.cloudinary.com/global/all.js"
          strategy="beforeInteractive"
        />
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=G-4C95VFVS84`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-4C95VFVS84');
            `}
          </Script>
        </>
      </body>
    </html>
  );
}
