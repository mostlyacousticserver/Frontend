import type { MetadataRoute } from "next";
import { fetchSeoIndex } from "@/api/seo";
import { absoluteUrl } from "@/lib/seo";

// Rebuild hourly so newly published content appears without a redeploy.
export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

const STATIC_ROUTES: {
  path: string;
  changeFrequency: Entry["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/courses", changeFrequency: "daily", priority: 0.9 },
  { path: "/free-courses", changeFrequency: "daily", priority: 0.85 },
  { path: "/songs", changeFrequency: "daily", priority: 0.8 },
  { path: "/blog", changeFrequency: "daily", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
];

/** Guard against an upstream sending an unparseable timestamp. */
function safeDate(value: string | null | undefined): Date {
  if (!value) return new Date();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const index = await fetchSeoIndex();
  // A failed index call must not take the whole sitemap down — the static
  // routes still get submitted.
  if (!index) return staticEntries;

  const courses: MetadataRoute.Sitemap = index.courses.map((item) => ({
    url: absoluteUrl(`/courses/${item.slug}`),
    lastModified: safeDate(item.updatedAt),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const blogs: MetadataRoute.Sitemap = index.blogs.map((item) => ({
    url: absoluteUrl(`/blog/${item.slug}`),
    lastModified: safeDate(item.publishedAt ?? item.updatedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const freeCourses: MetadataRoute.Sitemap = (index.freeCourses ?? []).map(
    (item) => ({
      url: absoluteUrl(`/free-courses/${item.slug}`),
      lastModified: safeDate(item.publishedAt ?? item.updatedAt),
      changeFrequency: "monthly",
      priority: 0.75,
    }),
  );

  const songs: MetadataRoute.Sitemap = index.songs.map((item) => ({
    url: absoluteUrl(`/songs/${item.slug}`),
    lastModified: safeDate(item.updatedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...courses, ...freeCourses, ...blogs, ...songs];
}
