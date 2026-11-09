import { cache } from "react";
import { fetchPublicJson } from "@/lib/fetch-public-api";
import { formatDuration } from "@/lib/course-utils";
import { mediaVersion } from "@/lib/image";
import { INSTRUCTOR } from "@/lib/site-config";
import type {
  CourseDetail,
  CourseModule,
  CourseOutlineChapter,
  CourseOutlineLesson,
  RelatedCourse,
} from "@/data/course";
import type {
  AdminCourse,
  FeaturedCourseCard,
  PaginatedCourses,
  PublicCourseDetail,
  PublicLesson,
  PublicModule,
} from "@/types/course";

const REVALIDATE_SECONDS = 60;
const PLACEHOLDER_IMAGE = "/images/course-1.jpg";
const PLACEHOLDER_AVATAR = "/images/pr1.jpeg";
const LEARNING_POINTS_CAP = 8;

/**
 * Courses are authored from the single admin account, whose display name is a
 * generic label rather than a person. Cards and detail pages should credit the
 * real instructor, so fall back to the configured name in that case.
 *
 * Renaming the account itself is the durable fix; this keeps the public pages
 * correct until then.
 */
const GENERIC_CREATOR_NAMES = new Set([
  "admin",
  "administrator",
  "instructor",
  "mostly acoustic",
]);

function instructorName(raw?: string | null) {
  const name = raw?.trim();
  if (!name || GENERIC_CREATOR_NAMES.has(name.toLowerCase())) return INSTRUCTOR.name;
  return name;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

const COURSE_FEATURES: CourseDetail["features"] = [
  { label: "Lifetime Access", icon: "infinity" },
  { label: "Access on Mobile & TV", icon: "devices" },
  { label: "Certificate of Completion", icon: "certificate" },
  { label: "Downloadable Resources", icon: "download" },
  { label: "Private Community Access", icon: "users" },
  { label: "30-Day Money Back Guarantee", icon: "shield" },
];

async function fetchJson<T>(path: string): Promise<{ ok: true; data: T } | { ok: false; status: number }> {
  return fetchPublicJson<T>(path, REVALIDATE_SECONDS);
}

/**
 * Memoized for the lifetime of a request: `generateMetadata`, the page body,
 * and the OG image route all ask for the same course, and React's `cache`
 * collapses that into a single upstream call.
 */
export const fetchPublishedCourse = cache(async function fetchPublishedCourse(
  slug: string,
): Promise<PublicCourseDetail | null> {
  const result = await fetchJson<PublicCourseDetail>(
    `/courses/${encodeURIComponent(slug)}`,
  );
  if (!result.ok) {
    return null;
  }
  return result.data;
});

/** Lesson count and total runtime, used for structured data and OG cards. */
export function courseStats(course: PublicCourseDetail) {
  let lessonCount = 0;
  let totalSeconds = 0;

  for (const courseModule of course.modules ?? []) {
    for (const chapter of courseModule.chapters ?? []) {
      for (const lesson of chapter.lessons ?? []) {
        lessonCount += 1;
        totalSeconds += lesson.videoDurationSeconds ?? 0;
      }
    }
  }

  return { lessonCount, totalSeconds, totalMinutes: Math.round(totalSeconds / 60) };
}

/** First page of published courses, for server-rendered listings and sitemaps. */
export async function fetchPublishedCourses(query: {
  page?: number;
  limit?: number;
  level?: string;
} = {}): Promise<PaginatedCourses> {
  const params = new URLSearchParams();
  params.set("page", String(query.page ?? 1));
  params.set("limit", String(query.limit ?? 12));
  if (query.level && query.level !== "all") params.set("level", query.level);

  const result = await fetchJson<PaginatedCourses>(`/courses?${params.toString()}`);
  if (!result.ok) {
    return { items: [], total: 0, page: query.page ?? 1, limit: query.limit ?? 12 };
  }
  return result.data;
}

export async function fetchRelatedPublishedCourses(
  categoryId: string,
  slug: string,
  limit = 4,
): Promise<AdminCourse[]> {
  const params = new URLSearchParams({
    categoryId,
    limit: String(limit + 1),
  });
  const result = await fetchJson<PaginatedCourses>(`/courses?${params.toString()}`);
  if (!result.ok) return [];
  return result.data.items.filter((course) => course.slug !== slug).slice(0, limit);
}

export function publicCourseToViewModel(
  course: PublicCourseDetail,
  related: AdminCourse[] = [],
): CourseDetail {
  const outline = toOutline(course.modules);
  const modules = flattenOutline(outline);
  const thumbnail = courseThumbnailSrc(course);
  const reviews = (course.testimonials ?? []).map((item) => ({
    id: item.id,
    name: item.studentName,
    avatar: mediaSrc(item.studentPhotoUrl, PLACEHOLDER_AVATAR),
    rating: item.rating,
    date: formatReviewDate(item.createdAt),
    text: item.message,
  }));
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        ).toFixed(1)
      : "";
  const enrollments = course._count?.enrollments ?? 0;
  const price = toAmount(course.price);
  const discountPrice =
    course.discountPrice == null ? null : toAmount(course.discountPrice);
  const hasDiscount =
    discountPrice != null && discountPrice < price && Number.isFinite(discountPrice);
  const displayPrice = hasDiscount ? discountPrice : price;
  const discountPercent = hasDiscount
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;
  const chapterTitles = course.modules.flatMap((module) =>
    module.chapters.map((chapter) => chapter.title.trim()).filter(Boolean),
  );

  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    subtitle: course.shortDescription,
    description: course.description?.trim() || undefined,
    level: formatLevel(course.level),
    image: thumbnail,
    previewImage: thumbnail,
    rating: avgRating,
    reviewCount: reviews.length > 0 ? String(reviews.length) : "",
    enrolledCount: enrollments > 0 ? enrollments.toLocaleString("en-IN") : "",
    lastUpdated: formatUpdatedAt(course.updatedAt),
    language: "",
    learningPoints: [...new Set(chapterTitles)].slice(0, LEARNING_POINTS_CAP),
    requirements: [],
    audience: [],
    features: COURSE_FEATURES,
    modules,
    outline,
    instructor: {
      name: instructorName(course.creator?.name),
      role: "Instructor",
      avatar: mediaSrc(course.creator?.avatarUrl, PLACEHOLDER_AVATAR),
      bio: "",
      experience: "",
      students: enrollments > 0 ? enrollments.toLocaleString("en-IN") : "",
      rating: avgRating,
      courses: "",
    },
    pricing: {
      price: displayPrice,
      originalPrice: price,
      currency: currencySymbol(course.currency),
      discountPercent,
      offerLabel: hasDiscount ? "Limited-time offer" : "",
    },
    reviews,
    faqs: (course.faqs ?? []).map((faq) => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
    })),
    relatedCourses: related.map(toRelatedCourse),
    comingSoon: Boolean(course.isComingSoon),
  };
}

function toOutline(modules: PublicModule[]): CourseOutlineChapter[] {
  return modules
    .map((module) => {
      const nested = module.chapters
        .map((chapter) => ({
          id: chapter.id,
          title: chapter.title,
          lessons: chapter.lessons.map(toOutlineLesson),
        }))
        .filter((chapter) => chapter.lessons.length > 0);

      const lessons = nested.flatMap((chapter) => chapter.lessons);
      const totalSeconds = module.chapters.reduce(
        (sum, chapter) =>
          sum +
          chapter.lessons.reduce(
            (lessonSum, lesson) => lessonSum + (lesson.videoDurationSeconds ?? 0),
            0,
          ),
        0,
      );

      return {
        id: module.id,
        title: module.title,
        lessonCount: lessons.length,
        duration: totalSeconds > 0 ? formatCompactDuration(totalSeconds) : "",
        modules: nested,
      };
    })
    .filter((chapter) => chapter.lessonCount > 0);
}

function toOutlineLesson(lesson: PublicLesson): CourseOutlineLesson {
  return {
    id: lesson.id,
    title: lesson.title,
    duration: formatDuration(lesson.videoDurationSeconds) ?? "",
    isPreview: lesson.isPreview,
    contentType: lesson.contentType,
  };
}

function flattenOutline(outline: CourseOutlineChapter[]): CourseModule[] {
  return outline.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    lessonCount: chapter.lessonCount,
    duration: chapter.duration,
    lessons: chapter.modules.flatMap((module) => module.lessons),
  }));
}

function toRelatedCourse(course: AdminCourse): RelatedCourse {
  const price = toAmount(course.discountPrice ?? course.price);
  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    image: courseThumbnailSrc(course),
    level: formatLevel(course.level),
    rating: "",
    price,
  };
}

function toAmount(value: string | number | null | undefined) {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? amount : 0;
}

function currencySymbol(code: string | null | undefined) {
  const value = (code ?? "INR").trim();
  if (!value) return "₹";
  if (value.length <= 2 && !/^[A-Z]{3}$/i.test(value)) return value;
  return CURRENCY_SYMBOLS[value.toUpperCase()] ?? value;
}

function mediaSrc(url: string | null | undefined, fallback: string) {
  const value = url?.trim();
  if (!value) return fallback;
  return value;
}

/**
 * Course thumbnails arrive presigned, with a signature that changes on every
 * API call, so pointing `next/image` at them directly defeats the optimizer's
 * cache and ships the untouched original to the browser. Addressing them by
 * slug through `/api/course-thumbnail` instead gives the optimizer a key it can
 * actually reuse — see that route for the full reasoning.
 *
 * Optimized entries cannot be invalidated by hand, so the src carries its own
 * version segment — see `mediaVersion` for how it is derived and why.
 */
export function courseThumbnailSrc(course: {
  slug: string;
  thumbnailUrl?: string | null;
}) {
  const signedUrl = course.thumbnailUrl?.trim();
  if (!signedUrl || !course.slug) return PLACEHOLDER_IMAGE;

  const version = mediaVersion(signedUrl) ?? "0";
  return `/api/course-thumbnail/${version}/${encodeURIComponent(course.slug)}`;
}

function formatLevel(level: string | null | undefined) {
  if (!level) return "All levels";
  if (level === "advanced") return "Pro";
  return level.charAt(0).toUpperCase() + level.slice(1);
}

export function publishedCourseToCard(course: AdminCourse): FeaturedCourseCard {
  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.shortDescription,
    image: courseThumbnailSrc(course),
    instructor: instructorName(course.creator?.name),
    instructorRole: "Guitar Instructor, Mostly Acoustic",
    instructorAvatar: mediaSrc(course.creator?.avatarUrl, PLACEHOLDER_AVATAR),
    level: formatLevel(course.level),
    duration: "",
    comingSoon: Boolean(course.isComingSoon),
  };
}

export function formatCompactDuration(totalSeconds: number) {
  if (!totalSeconds || totalSeconds < 0) return "0m";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.round((totalSeconds % 3600) / 60);
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${Math.max(minutes, totalSeconds > 0 ? 1 : 0)}m`;
}

function formatUpdatedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function formatReviewDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
