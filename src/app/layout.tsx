import React from 'react';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import 'simplebar-react/dist/simplebar.min.css';
import './css/globals.css';
import { Flowbite, ThemeModeScript } from 'flowbite-react';
import customTheme from '@/utils/theme/custom-theme';

const poppins = Poppins({
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Boris Boarman',
  description: 'AI-powered grant proposal evaluation platform',
};

export default function RootLayout(
  {
    children,
  }: {
    children: React.ReactNode;
  }) {
  return (
    <html lang="en">
    <head>
      <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
      <ThemeModeScript/>
    </head>
    <body className={poppins.className}>
    <Flowbite theme={{ theme: customTheme }}>{children}</Flowbite>
    </body>
    </html>
  );
}
