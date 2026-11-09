import { renderOgImage } from "@/lib/og-template";
import { fetchPublishedBlog } from "@/lib/public-blog";
import { resolveAuthorName } from "@/lib/blog-content";

export const revalidate = 3600;

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const blog = await fetchPublishedBlog(slug).catch(() => null);

  if (!blog) {
    return renderOgImage({
      eyebrow: "Blog",
      title: "Guitar lessons, tips, and practice routines",
    });
  }

  const published = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return renderOgImage({
    eyebrow: "Article",
    title: blog.title,
    subtitle: blog.metaDescription ?? undefined,
    meta: [resolveAuthorName(blog.author?.name), published].filter(Boolean),
  });
}
