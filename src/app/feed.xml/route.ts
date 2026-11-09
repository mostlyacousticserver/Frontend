import { fetchPublishedBlogs } from "@/lib/public-blog";
import { blogMediaSrc, resolveAuthorName } from "@/lib/blog-content";
import { absoluteUrl, getSiteUrl, toPlainText, truncate } from "@/lib/seo";
import { CONTACT, DEFAULT_DESCRIPTION, SITE_LANG, SITE_NAME } from "@/lib/site-config";

export const revalidate = 3600;

const FEED_SIZE = 30;

/** Escape the five XML predefined entities. */
function xml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rfc822(value: string | null | undefined) {
  const date = value ? new Date(value) : new Date();
  return (Number.isNaN(date.getTime()) ? new Date() : date).toUTCString();
}

/**
 * RSS 2.0 feed for the blog. Referenced from the root layout's
 * `alternates.types`, which is what feed readers and some aggregators discover.
 */
export async function GET() {
  const site = getSiteUrl();
  const { items } = await fetchPublishedBlogs({ page: 1, limit: FEED_SIZE });

  const entries = items
    .map((blog) => {
      const url = absoluteUrl(`/blog/${blog.slug}`);
      const description = truncate(
        toPlainText(blog.metaDescription ?? blog.title),
        300,
      );
      const image = blogMediaSrc(blog.coverImageUrl);

      return `    <item>
      <title>${xml(blog.title)}</title>
      <link>${xml(url)}</link>
      <guid isPermaLink="true">${xml(url)}</guid>
      <description>${xml(description)}</description>
      <pubDate>${rfc822(blog.publishedAt)}</pubDate>
      <dc:creator>${xml(resolveAuthorName(blog.author?.name))}</dc:creator>
      ${image ? `<enclosure url="${xml(absoluteUrl(image))}" type="image/jpeg" />` : ""}
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${xml(`${SITE_NAME} Blog`)}</title>
    <link>${xml(`${site}/blog`)}</link>
    <description>${xml(DEFAULT_DESCRIPTION)}</description>
    <language>${SITE_LANG}</language>
    <managingEditor>${xml(CONTACT.email)} (${xml(SITE_NAME)})</managingEditor>
    <lastBuildDate>${rfc822(items[0]?.publishedAt)}</lastBuildDate>
    <atom:link href="${xml(`${site}/feed.xml`)}" rel="self" type="application/rss+xml" />
${entries}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
