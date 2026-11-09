/**
 * Shared body of the stable-URL media routes (`/api/site-hero`,
 * `/api/course-thumbnail`): fetch a presigned original and hand its bytes on to
 * `next/image` under a cache key the optimizer can actually reuse.
 */

// The optimizer keeps an entry for whichever is longer, `minimumCacheTTL` or
// the upstream `Cache-Control`, so this is what makes the 30-day cache stick.
const CACHE_CONTROL = "public, max-age=31536000, s-maxage=31536000, immutable";

/**
 * How long to wait for S3 to *start* responding.
 *
 * Deliberately bounds time-to-headers only. An `AbortSignal` handed to `fetch`
 * stays armed for the lifetime of the response, so a deadline covering the whole
 * transfer aborts a large original mid-stream once the download outruns it —
 * which is exactly what a 5 MB hero on a slow link did here, surfacing as
 * `failed to pipe response` in the route and `upstream image response failed`
 * from the optimizer. The timer is cleared the moment headers land, leaving the
 * body to stream at whatever rate the connection allows.
 */
const HEADERS_TIMEOUT_MS = 15_000;

export async function streamSignedMedia(
  signedUrl: string,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), HEADERS_TIMEOUT_MS);

  let upstream: Response;
  try {
    upstream = await fetch(signedUrl, {
      // The signature is already short-lived and the response is cached by the
      // optimizer downstream; caching the bytes here too would only duplicate.
      cache: "no-store",
      signal: controller.signal,
    });
  } catch {
    return new Response(null, { status: 504 });
  } finally {
    clearTimeout(timer);
  }

  if (!upstream.ok || !upstream.body) {
    // A 403 here means the signature expired between the API call and this
    // fetch; the optimizer retries on the next request with a fresh one.
    return new Response(null, { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") ?? "image/jpeg";
  const contentLength = upstream.headers.get("content-length");

  return new Response(upstream.body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": CACHE_CONTROL,
      ...(contentLength ? { "Content-Length": contentLength } : {}),
    },
  });
}
