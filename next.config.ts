import type { NextConfig } from "next";

// The testing flag lives in .env.local, which is not cleared between builds, so
// the one way it reaches production is somebody building a deploy on a machine
// that still has it set. That build would ship live enrolment buttons onto the
// public certification pages. Say so loudly rather than silently.
if (process.env.NEXT_PUBLIC_LMS_TESTING === "1") {
  console.warn(
    "\n  !! NEXT_PUBLIC_LMS_TESTING=1 - this build exposes the LMS nav, sign-in\n" +
      "     and enrolment. Do NOT deploy it. Unset it in .env.local first.\n",
  );
}

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
