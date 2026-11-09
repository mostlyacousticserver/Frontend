import type { NextConfig } from "next";

/**
 * Long-lived, immutable assets. Everything under these paths is content-hashed
 * by the build, so a one-year cache is safe and removes repeat-view requests
 * from the critical path.
 */
const IMMUTABLE_CACHE = "public, max-age=31536000, immutable";

const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  // Only sent over HTTPS by browsers; harmless on localhost.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Removes the `X-Powered-By: Next.js` fingerprint.
  poweredByHeader: false,
  compress: true,
  images: {
    // Next 16 rejects any upstream image whose hostname resolves to a
    // non-`unicast` address. On a DNS64/NAT64 network (IPv6-only Wi-Fi, most
    // mobile hotspots) S3's public IPv4 addresses come back synthesized into
    // `64:ff9b::/96`, which ipaddr.js classifies as `rfc6052` rather than
    // `unicast` — so a perfectly public bucket is flagged as private and the
    // optimizer 400s. `next dev` relaxes the check automatically; a local
    // `next build && next start` runs with NODE_ENV=production and needs the
    // opt-in below, which lives in the gitignored `.env` so it never reaches a
    // real deploy. Production keeps the SSRF protection, which matters while
    // `remotePatterns` still allows any host. Read at build time — `next start`
    // serves the value baked into `.next/required-server-files.json`.
    dangerouslyAllowLocalIP:
      process.env.NODE_ENV !== "production" ||
      process.env.ALLOW_LOCAL_IP_IMAGES === "1",
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.cloudfront.net" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
      {
        source: "/:path*.(svg|jpg|jpeg|png|webp|avif|ico|woff2)",
        headers: [{ key: "Cache-Control", value: IMMUTABLE_CACHE }],
      },
      {
        // Let crawlers and CDNs cache the discovery documents for an hour while
        // serving stale copies during revalidation.
        source: "/:path(sitemap.xml|robots.txt|feed.xml)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Consolidate legacy/alternate paths onto the canonical URLs so link
      // equity lands on one address per page.
      { source: "/courses/index", destination: "/courses", permanent: true },
      { source: "/blogs", destination: "/blog", permanent: true },
      { source: "/blogs/:slug", destination: "/blog/:slug", permanent: true },
      { source: "/song/:slug", destination: "/songs/:slug", permanent: true },
      { source: "/course/:slug", destination: "/courses/:slug", permanent: true },
      { source: "/rss", destination: "/feed.xml", permanent: true },
      { source: "/rss.xml", destination: "/feed.xml", permanent: true },
    ];
  },
};

export default nextConfig;
