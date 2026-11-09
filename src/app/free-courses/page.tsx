import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FreeCoursesView } from "@/components/free-courses/FreeCoursesView";
import { BreadcrumbBar } from "@/components/seo/BreadcrumbBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { blogMediaSrc } from "@/lib/blog-content";
import { collectionPageJsonLd } from "@/lib/json-ld";
import { fetchPublishedFreeCourses } from "@/lib/public-free-course";
import { buildPageMetadata, stableImageUrl } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

export const revalidate = 3600;

const PAGE_SIZE = 8;
const DESCRIPTION = `Free guitar lessons and mini courses from ${SITE_NAME} — text, diagrams, and images you can read without enrolling or paying.`;

export const metadata: Metadata = buildPageMetadata({
  title: "Free Guitar Courses & Mini Lessons",
  description: DESCRIPTION,
  path: "/free-courses",
  image: "/og",
  keywords: [
    "free guitar courses",
    "free guitar lessons",
    "learn guitar free",
    "guitar mini lessons",
  ],
});

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Free Courses", path: "/free-courses" },
];

export default async function FreeCoursesRoutePage() {
  const { items, total } = await fetchPublishedFreeCourses({
    page: 1,
    limit: PAGE_SIZE,
  });

  return (
    <main id="main-content" className="min-h-screen overflow-x-clip bg-white">
      <JsonLd
        id="ld-free-courses"
        data={collectionPageJsonLd({
          path: "/free-courses",
          name: `Free courses by ${SITE_NAME}`,
          description: DESCRIPTION,
          breadcrumbLabel: "Free Courses",
          items: items.map((course) => ({
            name: course.title,
            path: `/free-courses/${course.slug}`,
            image: stableImageUrl(blogMediaSrc(course.coverImageUrl)),
          })),
        })}
      />
      <Navbar variant="light" />
      <BreadcrumbBar items={BREADCRUMBS} />
      <FreeCoursesView initialItems={items} initialTotal={total} />
      <Footer />
    </main>
  );
}
