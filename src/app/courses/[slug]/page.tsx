import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchSeoIndex } from "@/api/seo";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CourseDetailView } from "@/components/course-detail/CourseDetailView";
import { BreadcrumbBar } from "@/components/seo/BreadcrumbBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { courseJsonLd } from "@/lib/json-ld";
import {
  courseStats,
  fetchPublishedCourse,
  fetchRelatedPublishedCourses,
  publicCourseToViewModel,
} from "@/lib/public-course";
import { buildPageMetadata, stableImageUrl } from "@/lib/seo";
import type { PublicCourseDetail } from "@/types/course";

/**
 * Prerender every published course at build time so crawlers get a cached HTML
 * response instead of paying for an origin fetch. Unknown slugs still render
 * on demand (`dynamicParams` defaults to true), and a failed index call simply
 * leaves every course dynamic rather than failing the build.
 */
export async function generateStaticParams() {
  const index = await fetchSeoIndex();
  return index?.courses.map((course) => ({ slug: course.slug })) ?? [];
}

type CoursePageProps = {
  params: Promise<{ slug: string }>;
};

function offerPrice(course: PublicCourseDetail) {
  const price = Number(course.price);
  const discount =
    course.discountPrice == null ? NaN : Number(course.discountPrice);
  if (Number.isFinite(discount) && discount < price) return discount;
  return Number.isFinite(price) ? price : 0;
}

/**
 * A durable image URL for social cards and structured data: the thumbnail if
 * it is not a presigned URL, otherwise the generated branded card.
 */
function courseImage(course: PublicCourseDetail) {
  return stableImageUrl(course.thumbnailUrl) ?? `/og/course/${course.slug}`;
}

/** Admin-authored meta fields win; otherwise fall back to the course copy. */
function courseSeoCopy(course: PublicCourseDetail) {
  return {
    title: course.metaTitle?.trim() || course.title,
    description:
      course.metaDescription?.trim() ||
      course.shortDescription?.trim() ||
      course.description?.trim() ||
      course.title,
  };
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await fetchPublishedCourse(slug);

  if (!course) {
    return { title: "Course not found", robots: { index: false, follow: true } };
  }

  const { title, description } = courseSeoCopy(course);

  return buildPageMetadata({
    title,
    description,
    path: `/courses/${course.slug}`,
    image: courseImage(course),
    imageAlt: `${course.title} — online guitar course`,
    modifiedTime: course.updatedAt,
    keywords: [course.title, course.category?.name, "guitar course"].filter(
      (item): item is string => Boolean(item),
    ),
  });
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = await fetchPublishedCourse(slug);

  if (!course) {
    notFound();
  }

  const related = await fetchRelatedPublishedCourses(course.categoryId, slug);
  const view = publicCourseToViewModel(course, related);
  const { title, description } = courseSeoCopy(course);
  const reviews = course.testimonials ?? [];
  const ratingValue =
    reviews.length > 0
      ? reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length
      : undefined;
  const { lessonCount, totalMinutes } = courseStats(course);

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: course.title, path: `/courses/${course.slug}` },
  ];

  return (
    <main id="main-content" className="min-h-screen overflow-x-clip bg-white">
      <JsonLd
        id="ld-course"
        data={courseJsonLd({
          name: title,
          description,
          path: `/courses/${course.slug}`,
          image: courseImage(course),
          price: offerPrice(course),
          currency: course.currency || "INR",
          level: course.level,
          durationMinutes: totalMinutes,
          lessonCount,
          enrollmentCount: course._count?.enrollments,
          instructorName: course.creator?.name,
          datePublished: course.createdAt,
          dateModified: course.updatedAt,
          ratingValue,
          reviewCount: reviews.length || undefined,
          reviews: reviews.map((review) => ({
            author: review.studentName,
            rating: review.rating,
            body: review.message,
          })),
        })}
      />
      <Navbar variant="light" />
      <BreadcrumbBar items={breadcrumbs} />
      <CourseDetailView course={view} />
      <Footer />
    </main>
  );
}
