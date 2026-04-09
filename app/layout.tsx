import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { AuthProvider } from "@/context/AuthContext";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.propbnb.com";

//TODO clean up te page and re validate propper metatags
//TODO add a correct favicon
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "PropBnb",
  title: {
    default: "PropBnb | Book unique stays and vacation rentals",
    template: "%s | PropBnb",
  },
  description:
    "PropBnb helps travelers discover and book unique homes, apartments, and short stays with secure checkout and trusted hosts.",
  keywords: [
    "PropBnb",
    "vacation rentals",
    "holiday rentals",
    "short stay booking",
    "holiday homes",
    "book accommodation online",
    "travel accommodation",
    "unique stays",
  ],
  authors: [{ name: "PropBnb" }],
  creator: "PropBnb",
  publisher: "PropBnb",
  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "PropBnb | Find and book unique places to stay",
    description:
      "Browse vacation rentals, apartments, and hand-picked stays on PropBnb. Book securely and travel with confidence.",
    url: "/",
    siteName: "PropBnb",
    images: [
      {
        url: "/hero-image.jpg",
        width: 1200,
        height: 630,
        alt: "PropBnb vacation rental discovery experience",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "PropBnb | Book unique stays",
    description:
      "Discover unique stays, book securely, and travel smarter with PropBnb.",
    images: ["/hero-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
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
      <body className="text-slate-900 min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
