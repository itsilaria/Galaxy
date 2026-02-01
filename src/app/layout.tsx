import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Galaxy of Secrets | An Anonymous Confession Universe",
  description: "Share your deepest secrets anonymously in a beautiful 3D galaxy. Watch your confession become a star in the constellation of human mysteries.",
  keywords: ["secrets", "anonymous confessions", "3D galaxy", "interactive art", "mystery", "segreti", "anonimo"],
  authors: [{ name: "The Galaxy Explorer" }],
  openGraph: {
    title: "The Galaxy of Secrets",
    description: "What's your secret? Add it to the constellation.",
    url: "https://galassia-segreta-2026.vercel.app/",
    siteName: "The Galaxy of Secrets",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Galaxy of Secrets",
    description: "Share your secret anonymously in the 3D galaxy.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "google9c5f88a16208260f",
  },
};

import ErrorBoundary from "@/components/UI/ErrorBoundary";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}

