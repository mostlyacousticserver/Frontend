import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

/**
 * Paths matched by prefix, so `/admin` also covers `/admin/courses` etc.
 * Everything here is either account-gated, transactional, or a duplicate of a
 * canonical public page — none of it should ever reach the index.
 */
const PRIVATE_PATHS = [
  "/admin",
  "/learn",
  "/learning",
  "/checkout",
  "/login",
  "/signup",
  "/verify-otp",
  "/auth",
  "/api/",
];

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      {
        // Google honours wildcard patterns, so we can additionally strip the
        // faceted/query duplicates that would otherwise split ranking signals.
        userAgent: "Googlebot",
        allow: "/",
        disallow: [...PRIVATE_PATHS, "/*?*page=", "/*?*sort=", "/*?*utm_"],
      },
      {
        // Next's image optimizer serves the same pictures under a different
        // URL; indexing it creates duplicate image results.
        userAgent: "Googlebot-Image",
        allow: "/",
        disallow: [...PRIVATE_PATHS, "/_next/image"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
