/**
 * Whether a src has to bypass `next/image`'s optimizer.
 *
 * Media that comes back from the API is presigned: the signature and an
 * `X-Amz-Expires` window live in the query string and are reissued on every
 * call, so the URL is unique per request. The optimizer keys its cache on the
 * full src, which makes such a URL a guaranteed miss — it would re-download and
 * re-encode the same bytes for every visitor — and its upstream-fetch guard
 * also rejects hosts resolving to non-unicast addresses, which is what a
 * DNS64/NAT64 network turns every public S3 address into. Those sources are
 * therefore handed to the browser directly.
 *
 * The catch is that "directly" means the untouched original, at whatever size
 * it was uploaded. Anything on a hot path should be given a stable local URL
 * instead so the optimizer can do its job — see `courseThumbnailSrc` and
 * `/api/course-thumbnail` for how course art does that. Bundled assets under
 * `/` are optimized as usual.
 */
export function isRemoteImage(src: string): boolean {
  return !src.startsWith("/");
}

/**
 * Short, stable digest of the object key inside a presigned media URL.
 *
 * Every stable-URL route above needs a cache-busting segment, because optimized
 * entries cannot be invalidated by hand. Deriving it from the S3 key — which is
 * UUID-prefixed at upload, and therefore changes exactly when the bytes behind
 * an address change — means unrelated edits do not force a re-optimize, and
 * that any caller can compute it from the presigned URL alone.
 */
export function mediaVersion(signedUrl: string): string | null {
  let key: string;
  try {
    // The base only matters for stored values that are already bare keys.
    key = new URL(signedUrl, "https://media.invalid").pathname;
  } catch {
    return null;
  }
  if (!key) return null;

  // FNV-1a: short enough to keep the markup readable, and a collision only
  // costs a stale image on one address rather than anything correctness-bearing.
  let hash = 0x811c9dc5;
  for (let index = 0; index < key.length; index += 1) {
    hash ^= key.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}
