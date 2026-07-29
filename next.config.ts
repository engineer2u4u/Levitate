import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // SiteGround is shared Apache/PHP hosting and cannot run a Node server, so
  // the site is exported as plain static files.
  output: "export",

  // Emits about/index.html rather than about.html, which Apache serves via
  // DirectoryIndex with no rewrite rules needed.
  trailingSlash: true,

  // next/image optimisation needs a Node runtime; not available on a static host.
  images: { unoptimized: true },
};

export default nextConfig;
