import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BlogView } from "@/components/blog/BlogView";
import { BreadcrumbBar } from "@/components/seo/BreadcrumbBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { blogMediaSrc } from "@/lib/blog-content";
import { collectionPageJsonLd } from "@/lib/json-ld";
import { fetchPublishedBlogs } from "@/lib/public-blog";
import { buildPageMetadata, stableImageUrl } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

export const revalidate = 3600;

const PAGE_SIZE = 8;
const DESCRIPTION = `Guitar lessons, practice routines, gear notes, and learning tips from ${SITE_NAME} to help you become a better guitarist — one lesson at a time.`;

export const metadata: Metadata = buildPageMetadata({
  title: "Guitar Blog & Practice Tips",
  description: DESCRIPTION,
  path: "/blog",
  image: "/og",
  keywords: [
    "guitar blog",
    "guitar practice tips",
    "learn guitar faster",
    "guitar practice routine",
  ],
  rssPath: "/feed.xml",
});

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog" },
];

export default async function BlogRoutePage() {
  const { items, total } = await fetchPublishedBlogs({ page: 1, limit: PAGE_SIZE });

  return (
    <main id="main-content" className="min-h-screen overflow-x-clip bg-white">
      <JsonLd
        id="ld-blog"
        data={collectionPageJsonLd({
          path: "/blog",
          name: `${SITE_NAME} blog`,
          description: DESCRIPTION,
          breadcrumbLabel: "Blog",
          items: items.map((blog) => ({
            name: blog.title,
            path: `/blog/${blog.slug}`,
            image: stableImageUrl(blogMediaSrc(blog.coverImageUrl)),
          })),
        })}
      />
      <Navbar variant="light" />
      <BreadcrumbBar items={BREADCRUMBS} />
      <BlogView initialBlogs={items} initialTotal={total} />
      <Footer />
    </main>
  );
}
