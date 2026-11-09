import { renderOgImage } from "@/lib/og-template";
import {
  courseStats,
  fetchPublishedCourse,
  formatCompactDuration,
} from "@/lib/public-course";

export const revalidate = 3600;

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const course = await fetchPublishedCourse(slug).catch(() => null);

  if (!course) {
    return renderOgImage({
      eyebrow: "Course",
      title: "Acoustic guitar courses",
      subtitle: "Structured, beginner-to-pro video lessons.",
    });
  }

  const { lessonCount, totalSeconds } = courseStats(course);

  return renderOgImage({
    eyebrow: "Course",
    title: course.title,
    subtitle: course.shortDescription ?? undefined,
    meta: [
      course.level ? `${course.level[0].toUpperCase()}${course.level.slice(1)}` : "",
      lessonCount ? `${lessonCount} lessons` : "",
      totalSeconds ? formatCompactDuration(totalSeconds) : "",
    ].filter((item): item is string => Boolean(item)),
  });
}
