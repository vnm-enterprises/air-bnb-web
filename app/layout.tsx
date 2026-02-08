import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

//TODO clean up te page and re validate propper metatags
//TODO add a correct favicon
export const metadata: Metadata = {
  title: {
    default: "Airbnb-style Stays | Find & Book Unique Places",
    template: "%s | Airbnb-style Stays",
  },
  description:
    "Discover and book unique homes, apartments, and stays from trusted hosts. Easy booking, secure payments, and unforgettable experiences.",
  keywords: [
    "vacation rentals",
    "short stay",
    "airbnb alternative",
    "holiday homes",
    "book stays",
    "travel accommodation",
  ],
  authors: [{ name: "MES" }],
  creator: "MES",

  openGraph: {
    title: "Find & Book Unique Places to Stay",
    description:
      "Browse hand-picked homes and apartments. Book stays securely and travel with confidence.",
    url: "https://airbnb.com",
    siteName: "Airbnb-style Stays",
    images: [
      {
        url: "https://airbnb.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Discover unique places to stay",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Find & Book Unique Places to Stay",
    description:
      "Discover unique stays, book securely, and travel smarter.",
    images: ["https://airbnb.com/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },

  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
