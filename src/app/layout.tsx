import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Spotify',
  description: 'Spotify Music Player - Curated tracks, playlists, queue, and playback',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Spotify',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#121212',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white antialiased overflow-x-hidden selection:bg-[#1DB954] selection:text-black">
        {children}
      </body>
    </html>
  );
}
