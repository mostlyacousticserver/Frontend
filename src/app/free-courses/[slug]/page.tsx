import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchSeoIndex } from "@/api/seo";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FreeCourseArticle } from "@/components/free-courses/FreeCourseArticle";
import { BreadcrumbBar } from "@/components/seo/BreadcrumbBar";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  blogMediaSrc,
  countContentWords,
  flattenInline,
  normalizeBlogContent,
  resolveAuthorName,
} from "@/lib/blog-content";
import { articleJsonLd } from "@/lib/json-ld";
import {
  fetchPublishedFreeCourse,
  fetchPublishedFreeCourses,
} from "@/lib/public-free-course";
import { buildPageMetadata, stableImageUrl, truncate } from "@/lib/seo";
import type { FreeCourseDetail } from "@/types/free-course";

export async function generateStaticParams() {
  const index = await fetchSeoIndex();
  return index?.freeCourses?.map((course) => ({ slug: course.slug })) ?? [];
}

type FreeCourseDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

function freeCourseSeoCopy(freeCourse: FreeCourseDetail) {
  const title = freeCourse.metaTitle?.trim() || freeCourse.title;
  const authored = freeCourse.metaDescription?.trim();
  if (authored) return { title, description: authored };

  if (freeCourse.shortDescription?.trim()) {
    return { title, description: freeCourse.shortDescription.trim() };
  }

  const content = normalizeBlogContent(freeCourse.content);
  const firstParagraph = content.blocks.find(
    (block) =>
      block.type === "paragraph" &&
      flattenInline(block.children).trim().length > 40,
  );

  return {
    title,
    description:
      firstParagraph && firstParagraph.type === "paragraph"
        ? truncate(flattenInline(firstParagraph.children), 160)
        : freeCourse.title,
  };
}

function shareImage(freeCourse: FreeCourseDetail) {
  return (
    stableImageUrl(blogMediaSrc(freeCourse.coverImageUrl)) ??
    `/og/free-course/${freeCourse.slug}`
  );
}

export async function generateMetadata({
  params,
}: FreeCourseDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const freeCourse = await fetchPublishedFreeCourse(slug);

  if (!freeCourse) {
    return { title: "Course not found", robots: { index: false, follow: true } };
  }

  const { title, description } = freeCourseSeoCopy(freeCourse);

  return buildPageMetadata({
    title,
    description,
    path: `/free-courses/${freeCourse.slug}`,
    image: shareImage(freeCourse),
    imageAlt: freeCourse.title,
    type: "article",
    publishedTime: freeCourse.publishedAt,
    modifiedTime: freeCourse.updatedAt,
    authors: [resolveAuthorName(freeCourse.author?.name)],
    section: "Free guitar lessons",
  });
}

export default async function FreeCourseDetailsPage({
  params,
}: FreeCourseDetailsPageProps) {
  const { slug } = await params;
  const freeCourse = await fetchPublishedFreeCourse(slug);

  if (!freeCourse) {
    notFound();
  }

  const related = await fetchPublishedFreeCourses({ page: 1, limit: 4 });
  const relatedCourses = related.items
    .filter((item) => item.slug !== slug)
    .slice(0, 3);
  const { title, description } = freeCourseSeoCopy(freeCourse);
  const wordCount = countContentWords(normalizeBlogContent(freeCourse.content));

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Free Courses", path: "/free-courses" },
    { name: freeCourse.title, path: `/free-courses/${freeCourse.slug}` },
  ];

  return (
    <main id="main-content" className="min-h-screen overflow-x-clip bg-white">
      <JsonLd
        id="ld-free-course"
        data={articleJsonLd({
          headline: title,
          description,
          path: `/free-courses/${freeCourse.slug}`,
          image: shareImage(freeCourse),
          datePublished: freeCourse.publishedAt,
          dateModified: freeCourse.updatedAt,
          authorName: resolveAuthorName(freeCourse.author?.name),
          wordCount,
          section: "Free guitar lessons",
        })}
      />
      <Navbar variant="light" />
      <BreadcrumbBar items={breadcrumbs} />
      <FreeCourseArticle
        freeCourse={freeCourse}
        relatedCourses={relatedCourses}
      />
      <Footer />
    </main>
  );
}
