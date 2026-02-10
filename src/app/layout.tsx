import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/UI/ErrorBoundary";

const _geistSans = Geist({
  subsets: ["latin"],
});

const _geistMono = Geist_Mono({
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "The Galaxy of Secrets | An Anonymous Confession Universe",
  description:
    "Share your deepest secrets anonymously in a beautiful 3D galaxy. Watch your confession become a star in the constellation of human mysteries.",
  keywords: [
    "secrets",
    "anonymous confessions",
    "3D galaxy",
    "interactive art",
    "mystery",
    "segreti",
    "anonimo",
  ],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
