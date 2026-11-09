export type SeoIndexEntry = {
  slug: string;
  updatedAt: string;
};

export type SeoIndex = {
  generatedAt: string;
  courses: SeoIndexEntry[];
  blogs: (SeoIndexEntry & { publishedAt: string | null })[];
  freeCourses: (SeoIndexEntry & { publishedAt: string | null })[];
  songs: SeoIndexEntry[];
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export async function fetchSeoIndex(): Promise<SeoIndex | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/seo/index`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    return (await response.json()) as SeoIndex;
  } catch {
    return null;
  }
}
