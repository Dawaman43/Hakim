import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hakim Health",
  description: "Hakim helps Ethiopians skip hospital queues with digital token booking, real-time updates, and emergency guidance.",
  keywords: ["Hakim", "Ethiopia", "Healthcare", "Queue Management", "Hospital", "Digital Token", "SMS"],
  authors: [{ name: "Hakim Health" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Hakim Health",
    description: "Skip the wait with digital hospital queues and real-time updates.",
    url: "https://hakim.et",
    siteName: "Hakim",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hakim Health",
    description: "Skip the wait with digital hospital queues and real-time updates.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
