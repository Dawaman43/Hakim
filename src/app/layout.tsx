import type { Metadata } from "next";
import { getUiPreferences } from "@/app/ui-preferences";
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
  metadataBase: new URL('https://hakim.et'),
  title: {
    default: "Hakim Health | Digital Hospital Queues & Booking in Ethiopia",
    template: "%s | Hakim Health"
  },
  description: "Hakim is Ethiopia's leading healthcare platform. Skip hospital queues, book doctors, get real-time token updates, and find emergency guidance instantly.",
  keywords: ["Hakim", "Ethiopia", "Healthcare", "Queue Management", "Hospital Booking", "Digital Token", "SMS updates", "Find Doctors Ethiopia", "Telemedicine Addis Ababa"],
  authors: [{ name: "Hakim Health", url: "https://hakim.et" }],
  creator: "Hakim Health",
  publisher: "Hakim Health",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'am-ET': '/am-ET',
    },
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Hakim Health | Digital Hospital Queues",
    description: "Skip the wait with digital hospital queues. Book your doctor securely and get real-time updates.",
    url: "https://hakim.et",
    siteName: "Hakim",
    images: [
      {
        url: '/logo.png', // Fallback OG image
        width: 800,
        height: 600,
        alt: 'Hakim Health Logo',
      },
    ],
    locale: 'en_US',
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hakim Health | Streamlined Healthcare in Ethiopia",
    description: "Skip the wait in hospitals. Digital Queues and real-time token updates.",
    images: ['/logo.png'], // Fallback Twitter image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme, language } = await getUiPreferences();
  return (
    <html lang={language} className={theme === "dark" ? "dark" : ""} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
