import { cache } from "react";
import { fetchPublicJson, publicApiUrl } from "@/lib/fetch-public-api";
import type { BlogDetail, PaginatedBlogs } from "@/types/blog";

const REVALIDATE_SECONDS = 60;

/**
 * Memoized so the page, its `generateMetadata`, and the OG image route share a
 * single upstream request per post. Uses no-store so FAQ edits show up immediately
 * and a transient API outage cannot pin a 404 in the Next data cache.
 */
export const fetchPublishedBlog = cache(async function fetchPublishedBlog(
  slug: string,
): Promise<BlogDetail | null> {
  try {
    const response = await fetch(
      publicApiUrl(`/blogs/${encodeURIComponent(slug)}`),
      { cache: "no-store" },
    );
    if (!response.ok) return null;
    const text = await response.text();
    if (!text.trim()) return null;
    return JSON.parse(text) as BlogDetail;
  } catch {
    return null;
  }
});

export async function fetchPublishedBlogs(query: {
  page?: number;
  limit?: number;
  q?: string;
} = {}): Promise<PaginatedBlogs> {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.q) params.set("q", query.q);
  const qs = params.toString();
  const result = await fetchPublicJson<PaginatedBlogs>(
    `/blogs${qs ? `?${qs}` : ""}`,
    REVALIDATE_SECONDS,
  );
  if (!result.ok) {
    return { items: [], total: 0, page: query.page ?? 1, limit: query.limit ?? 20 };
  }
  return result.data;
}
