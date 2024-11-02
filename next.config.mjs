/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "www.promiedos.com.ar",
      },
    ],
  },
};

export default nextConfig;
