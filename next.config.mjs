/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*googleusercontent.com",
        port: ""
      },
    ],
  }
};

export default nextConfig;
