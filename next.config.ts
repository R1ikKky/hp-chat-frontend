import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const userService = process.env.BACKEND_URL ?? 'http://localhost:3000';
    const chatService =
      process.env.CHAT_BACKEND_URL ?? 'http://localhost:3003';

    return [
      {
        source: '/api/conversations/:path*',
        destination: `${chatService}/conversations/:path*`,
      },
      {
        source: '/api/conversations',
        destination: `${chatService}/conversations`,
      },
      {
        source: '/api/messages/:path*',
        destination: `${chatService}/messages/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${userService}/:path*`,
      },
    ];
  },
};

export default nextConfig;
