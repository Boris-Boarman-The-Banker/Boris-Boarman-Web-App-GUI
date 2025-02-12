import type { Metadata } from 'next';
import { Poppins } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import './globals.css';

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: 'Boris Boarman',
  description: 'AI-powered grant proposal evaluation platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        {children}
      </body>
    </html>
  );
}
