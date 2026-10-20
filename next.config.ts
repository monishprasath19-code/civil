import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kfezydsnhlvaldvnntux.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmZXp5ZHNuaGx2YWxkdm5udHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5NjY0MjgsImV4cCI6MjEwNjU0MjQyOH0.qJxmXSfZWP72xzAh5f_wLzbYHpQf01rqHJApYQ2okEw",
  },
};

export default nextConfig;
