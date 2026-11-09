import { streamSignedMedia } from "@/lib/media-proxy";
import { fetchPublishedCourse } from "@/lib/public-course";

/**
 * Stable-URL origin for course thumbnails.
 *
 * The catalogue API hands out presigned S3 URLs whose `X-Amz-Signature` and
 * `X-Amz-Date` are regenerated on *every* call, so the raw URL is unusable as
 * an image source: `/_next/image` keys its cache on the full `src`, and a src
 * that is unique per request can never hit that cache. The previous workaround
 * was to skip the optimizer entirely, which meant every visitor downloaded the
 * untouched original — an 11.9 MB PNG, in the live catalogue — to fill a card
 * roughly 400px wide.
 *
 * This route is the fixed address the optimizer can cache against: the slug is
 * stable and the signing happens server-side, where it is cheap. The version
 * segment is what busts that cache when the art behind a slug is replaced —
 * optimized entries cannot be invalidated by hand — and it sits in the path
 * rather than the query string so the src stays inside the default
 * `images.localPatterns`, which rejects local sources carrying a query.
 */
export async function GET(
  _request: Request,
  // `version` is only ever a cache key — the bytes are addressed by slug — so
  // it is deliberately not validated against the course it belongs to.
  { params }: { params: Promise<{ slug: string; version: string }> },
) {
  const { slug } = await params;

  const course = await fetchPublishedCourse(slug).catch(() => null);
  const signedUrl = course?.thumbnailUrl?.trim();
  if (!signedUrl) {
    return new Response(null, { status: 404 });
  }

  return streamSignedMedia(signedUrl);
}
