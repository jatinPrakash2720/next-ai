import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mystry Message - Anonymous Messages App",
  description:
    "Send and receive anonymous messages securely. Create your profile and let others send you anonymous messages without revealing their identity.",
  keywords: [
    "anonymous messages",
    "secret messages",
    "anonymous chat",
    "mystry message",
    "private messages",
  ],
  authors: [{ name: "Jatin Prakash" }],
  creator: "Jatin Prakash",
  openGraph: {
    title: "Mystry Message - Anonymous Messages App",
    description:
      "Send and receive anonymous messages securely. Create your profile and let others send you anonymous messages without revealing their identity.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mystry Message - Anonymous Messages App",
    description:
      "Send and receive anonymous messages securely. Create your profile and let others send you anonymous messages without revealing their identity.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
