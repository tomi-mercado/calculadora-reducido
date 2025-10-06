/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "api.promiedos.com.ar",
      },
    ],
  },
};

export default nextConfig;
