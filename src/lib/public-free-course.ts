import { cache } from "react";
import { fetchPublicJson } from "@/lib/fetch-public-api";
import type { FreeCourseDetail, PaginatedFreeCourses } from "@/types/free-course";

const REVALIDATE_SECONDS = 60;

export const fetchPublishedFreeCourse = cache(
  async function fetchPublishedFreeCourse(
    slug: string,
  ): Promise<FreeCourseDetail | null> {
    const result = await fetchPublicJson<FreeCourseDetail>(
      `/free-courses/${encodeURIComponent(slug)}`,
      REVALIDATE_SECONDS,
    );
    if (!result.ok) return null;
    return result.data;
  },
);

export async function fetchPublishedFreeCourses(query: {
  page?: number;
  limit?: number;
  q?: string;
} = {}): Promise<PaginatedFreeCourses> {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.q) params.set("q", query.q);
  const qs = params.toString();
  const result = await fetchPublicJson<PaginatedFreeCourses>(
    `/free-courses${qs ? `?${qs}` : ""}`,
    REVALIDATE_SECONDS,
  );
  if (!result.ok) {
    return {
      items: [],
      total: 0,
      page: query.page ?? 1,
      limit: query.limit ?? 20,
    };
  }
  return result.data;
}
