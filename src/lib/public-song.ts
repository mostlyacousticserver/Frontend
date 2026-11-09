import { cache } from "react";
import { fetchPublicJson } from "@/lib/fetch-public-api";
import type { PaginatedSongs, SongDetail, SongDifficulty } from "@/types/song";

const REVALIDATE_SECONDS = 60;

/**
 * Memoized so the page, its `generateMetadata`, and the OG image route share a
 * single upstream request per song.
 */
export const fetchPublishedSong = cache(async function fetchPublishedSong(
  slug: string,
): Promise<SongDetail | null> {
  const result = await fetchPublicJson<SongDetail>(
    `/songs/${encodeURIComponent(slug)}`,
    REVALIDATE_SECONDS,
  );
  if (!result.ok) return null;
  return result.data;
});

export async function fetchPublishedSongs(query: {
  page?: number;
  limit?: number;
  genre?: string;
  difficulty?: SongDifficulty;
} = {}): Promise<PaginatedSongs> {
  const params = new URLSearchParams();
  params.set("page", String(query.page ?? 1));
  params.set("limit", String(query.limit ?? 10));
  if (query.genre) params.set("genre", query.genre);
  if (query.difficulty) params.set("difficulty", query.difficulty);

  const result = await fetchPublicJson<PaginatedSongs>(
    `/songs?${params.toString()}`,
    REVALIDATE_SECONDS,
  );

  if (!result.ok) {
    return { items: [], total: 0, page: query.page ?? 1, limit: query.limit ?? 10 };
  }
  return result.data;
}
