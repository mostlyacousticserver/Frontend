import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchSeoIndex } from "@/api/seo";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BlogArticle } from "@/components/blog/BlogArticle";
import { BreadcrumbBar } from "@/components/seo/BreadcrumbBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchPublishedBlog, fetchPublishedBlogs } from "@/lib/public-blog";
import {
  blogMediaSrc,
  countContentWords,
  flattenInline,
  normalizeBlogContent,
  resolveAuthorName,
} from "@/lib/blog-content";
import { articleJsonLd } from "@/lib/json-ld";
import { buildPageMetadata, stableImageUrl, truncate } from "@/lib/seo";
import type { BlogDetail } from "@/types/blog";

/**
 * Prerender every published post at build time; unknown slugs still render on
 * demand, and a failed index call leaves the route dynamic.
 */
export async function generateStaticParams() {
  const index = await fetchSeoIndex();
  return index?.blogs.map((blog) => ({ slug: blog.slug })) ?? [];
}

type BlogDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Meta description priority: the author's own meta description, then the first
 * real paragraph of the post, then the title. A description derived from body
 * copy beats repeating the headline.
 */
function blogSeoCopy(blog: BlogDetail) {
  const title = blog.metaTitle?.trim() || blog.title;
  const authored = blog.metaDescription?.trim();
  if (authored) return { title, description: authored };

  const content = normalizeBlogContent(blog.content);
  const firstParagraph = content.blocks.find(
    (block) => block.type === "paragraph" && flattenInline(block.children).trim().length > 40,
  );

  return {
    title,
    description:
      firstParagraph && firstParagraph.type === "paragraph"
        ? truncate(flattenInline(firstParagraph.children), 160)
        : blog.title,
  };
}

/**
 * A durable image URL for social cards and structured data. Cover images stored
 * behind presigned S3 URLs expire within minutes, so those fall back to the
 * generated branded card.
 */
function shareImage(blog: BlogDetail) {
  return stableImageUrl(blogMediaSrc(blog.coverImageUrl)) ?? `/og/blog/${blog.slug}`;
}

export async function generateMetadata({
  params,
}: BlogDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await fetchPublishedBlog(slug);

  if (!blog) {
    return { title: "Article not found", robots: { index: false, follow: true } };
  }

  const { title, description } = blogSeoCopy(blog);

  return buildPageMetadata({
    title,
    description,
    path: `/blog/${blog.slug}`,
    image: shareImage(blog),
    imageAlt: blog.title,
    type: "article",
    publishedTime: blog.publishedAt,
    modifiedTime: blog.updatedAt,
    authors: [resolveAuthorName(blog.author?.name)],
    section: "Guitar lessons",
    rssPath: "/feed.xml",
  });
}

export default async function BlogDetailsPage({
  params,
}: BlogDetailsPageProps) {
  const { slug } = await params;
  const blog = await fetchPublishedBlog(slug);

  if (!blog) {
    notFound();
  }

  const related = await fetchPublishedBlogs({ page: 1, limit: 4 });
  const relatedBlogs = related.items
    .filter((item) => item.slug !== slug)
    .slice(0, 3);
  const { title, description } = blogSeoCopy(blog);
  const wordCount = countContentWords(normalizeBlogContent(blog.content));

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: blog.title, path: `/blog/${blog.slug}` },
  ];

  return (
    <main id="main-content" className="min-h-screen overflow-x-clip bg-white">
      <JsonLd
        id="ld-article"
        data={articleJsonLd({
          headline: title,
          description,
          path: `/blog/${blog.slug}`,
          image: shareImage(blog),
          datePublished: blog.publishedAt,
          dateModified: blog.updatedAt,
          authorName: resolveAuthorName(blog.author?.name),
          wordCount,
          section: "Guitar lessons",
        })}
      />
      <Navbar variant="light" />
      <BreadcrumbBar items={breadcrumbs} />
      <BlogArticle blog={blog} relatedBlogs={relatedBlogs} />
      <Footer />
    </main>
  );
}
