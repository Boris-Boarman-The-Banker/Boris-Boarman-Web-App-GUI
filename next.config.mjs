/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*googleusercontent.com",
        port: ""
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'development'
          ? 'http://127.0.0.1:5328/api/:path*'
          : process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}/api/:path*`
            : '/api/:path*',
      },
    ];
  },
};

export default nextConfig;
