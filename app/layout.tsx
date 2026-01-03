import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { TimerProvider } from "./contexts/TimerContext";
import "./globals.css";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin", "thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Focus Flow - Productivity Dashboard & Pomodoro Timer",
    template: "%s | Focus Flow"
  },
  description: "Boost your productivity with Focus Flow - a modern Pomodoro timer, task manager, and focus dashboard. Stay organized, track your goals, and maintain deep focus with customizable timers and smart task management.",
  keywords: [
    "pomodoro timer",
    "productivity app",
    "focus timer",
    "task manager",
    "time management",
    "productivity dashboard",
    "focus sessions",
    "work productivity",
    "study timer",
    "time tracking"
  ],
  authors: [{ name: "Focus Flow Team" }],
  creator: "Focus Flow",
  publisher: "Focus Flow",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://focus-flow.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://focus-flow.app',
    title: 'Focus Flow - Productivity Dashboard & Pomodoro Timer',
    description: 'Boost your productivity with Focus Flow - a modern Pomodoro timer, task manager, and focus dashboard. Stay organized, track your goals, and maintain deep focus.',
    siteName: 'Focus Flow',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Focus Flow - Productivity Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Focus Flow - Productivity Dashboard & Pomodoro Timer',
    description: 'Boost your productivity with Focus Flow - a modern Pomodoro timer, task manager, and focus dashboard.',
    images: ['/og-image.png'],
    creator: '@focusflowapp',
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
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Focus Flow',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Focus Flow",
    "description": "A modern productivity dashboard with Pomodoro timer, task management, and focus tracking features.",
    "url": "https://focus-flow.app",
    "applicationCategory": "ProductivityApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Pomodoro Timer with multiple animation styles",
      "Task management with categories and priorities",
      "Time tracking and focus sessions",
      "Dark/Light theme support",
      "Fullscreen mode for distraction-free work",
      "Local data persistence"
    ],
    "author": {
      "@type": "Organization",
      "name": "Focus Flow Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Focus Flow"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body
        className={`${kanit.variable} antialiased font-sans`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TimerProvider>
            {children}
          </TimerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
