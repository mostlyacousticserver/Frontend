import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { CoursesPage } from "@/components/courses/CoursesPage";
import { Footer } from "@/components/Footer";
import { BreadcrumbBar } from "@/components/seo/BreadcrumbBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { collectionPageJsonLd } from "@/lib/json-ld";
import { fetchPublishedCourses, publishedCourseToCard } from "@/lib/public-course";
import { buildPageMetadata, stableImageUrl } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

// Rendered on the server and revalidated hourly so the catalogue ships inside
// the HTML rather than arriving after a client fetch.
export const revalidate = 3600;

const PAGE_SIZE = 8;
const DESCRIPTION = `Explore structured beginner-to-pro acoustic guitar courses from ${SITE_NAME} — chords, rhythm, strumming, fingerstyle, and complete songs, with lifetime access.`;

export const metadata: Metadata = buildPageMetadata({
  title: "Guitar Courses Online",
  description: DESCRIPTION,
  path: "/courses",
  image: "/og",
  keywords: [
    "online guitar courses",
    "acoustic guitar course",
    "beginner guitar lessons",
    "intermediate guitar course",
  ],
});

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Courses", path: "/courses" },
];

export default async function CoursesRoutePage() {
  const { items, total } = await fetchPublishedCourses({ page: 1, limit: PAGE_SIZE });
  const cards = items.map(publishedCourseToCard);

  return (
    <main id="main-content" className="min-h-screen overflow-x-clip bg-white">
      <JsonLd
        id="ld-courses"
        data={collectionPageJsonLd({
          path: "/courses",
          name: `Guitar courses by ${SITE_NAME}`,
          description: DESCRIPTION,
          breadcrumbLabel: "Courses",
          items: cards.map((course) => ({
            name: course.title,
            path: `/courses/${course.slug}`,
            image: stableImageUrl(course.image),
          })),
        })}
      />
      <Navbar variant="light" />
      <BreadcrumbBar items={BREADCRUMBS} />
      <CoursesPage initialCourses={cards} initialTotal={total} />
      <Footer />
    </main>
  );
}
