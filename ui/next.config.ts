import type { NextConfig } from "next";
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isProd && {
    output: "standalone", // chỉ khi production mới bật standalone
  }),
};

export default nextConfig;
