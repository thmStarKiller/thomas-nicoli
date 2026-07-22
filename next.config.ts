import type { NextConfig } from "next";

const isCloudflarePages = process.env.CLOUDFLARE_PAGES === "1";

const nextConfig: NextConfig = {
  ...(isCloudflarePages
    ? {
        output: "export" as const,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
