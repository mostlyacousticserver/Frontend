import { streamSignedMedia } from "@/lib/media-proxy";
import { fetchPublicSiteSettings } from "@/lib/site-settings";

/**
 * Stable-URL origin for the homepage hero image.
 *
 * The same problem `/api/course-thumbnail` solves, for the one image that is
 * also the homepage's LCP element: the settings API hands out a presigned S3
 * URL whose signature is regenerated on every call, so `/_next/image` — which
 * keys its cache on the full `src` — could never reuse an entry for it, and on
 * a DNS64/NAT64 network its upstream guard rejects the S3 host as private.
 *
 * This route is the fixed address the optimizer can cache against. The version
 * segment is what busts that cache when the admin replaces the hero, since
 * optimized entries cannot be invalidated by hand, and it sits in the path
 * rather than the query string so the src stays inside the default
 * `images.localPatterns`, which rejects local sources carrying a query.
 */
export async function GET() {
  // `version` is only ever a cache key — there is a single hero, addressed by
  // the settings record — so it is deliberately neither read nor validated.
  const settings = await fetchPublicSiteSettings();
  const signedUrl = settings.homeHeroImageUrl?.trim();
  if (!signedUrl) {
    return new Response(null, { status: 404 });
  }

  return streamSignedMedia(signedUrl);
}
