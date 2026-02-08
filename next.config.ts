import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    
  typescript:{
    ignoreBuildErrors:true
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "60mb", // or "5mb"
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
       {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },
    ],
  },

};



export default nextConfig;
