import type { NextConfig } from "next";

const backendOrigin = (
  process.env.WORDPRESS_API_ORIGIN ||
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "https://backend.lodgifyhub.com/wp-json"
).replace(/\/wp-json\/?$/, "");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.wp.com",
      },
      {
        protocol: "https",
        hostname: "*.wordpress.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/wp-json/:path*",
        destination: `${backendOrigin}/wp-json/:path*`,
      },
    ];
  },
};

export default nextConfig;
