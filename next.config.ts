import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  /* config options here */
    
  experimental: {
    serverActions: {
      bodySizeLimit: "60mb", // or "5mb"
    },
  },
  
  typescript:{
    ignoreBuildErrors:true
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

} satisfies NextConfig;



export default nextConfig;
