import type { PublicContentFaq } from "@/types/content-faq";

export type CourseLevel = "beginner" | "intermediate" | "advanced";

export type ContentType = "video" | "file" | "text";

export const COURSE_LEVELS = [
  "beginner",
  "intermediate",
  "advanced",
] as const;

export const CONTENT_TYPES = ["video", "file", "text"] as const;

export type CourseCategoryRef = {
  id: string;
  name: string;
  slug: string;
};

export type LessonResource = {
  id: string;
  lessonId: string;
  title: string;
  fileStorageKey: string;
  fileType: string;
  createdAt: string;
};

export type Lesson = {
  id: string;
  chapterId: string;
  title: string;
  contentType: ContentType;
  videoStorageKey: string | null;
  videoDurationSeconds: number | null;
  fileStorageKey: string | null;
  fileType: string | null;
  textContent: string | null;
  isPreview: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
  resources: LessonResource[];
};

export type Chapter = {
  id: string;
  moduleId: string;
  title: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  lessons: Lesson[];
};

export type CourseModule = {
  id: string;
  courseId: string;
  title: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  chapters: Chapter[];
};

export type AdminCourse = {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  thumbnailUrl: string;
  price: string | number;
  discountPrice: string | number | null;
  currency: string;
  level: CourseLevel | null;
  isPublished: boolean;
  isFeatured: boolean;
  isComingSoon: boolean;
  position: number;
  metaTitle: string | null;
  metaDescription: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  category: CourseCategoryRef;
  creator?: PublicCourseCreator;
};

export type AdminCourseDetail = AdminCourse & {
  modules: CourseModule[];
};

export type PublicLessonResource = {
  id: string;
  lessonId: string;
  title: string;
  fileType: string;
  createdAt: string;
};

export type PublicLesson = {
  id: string;
  chapterId: string;
  title: string;
  contentType: ContentType;
  videoDurationSeconds: number | null;
  isPreview: boolean;
  position: number;
  hasVideo: boolean;
  hasFile: boolean;
  resources: PublicLessonResource[];
};

export type PublicChapter = {
  id: string;
  moduleId: string;
  title: string;
  position: number;
  lessons: PublicLesson[];
};

export type PublicModule = {
  id: string;
  courseId: string;
  title: string;
  position: number;
  chapters: PublicChapter[];
};

export type PublicCourseCreator = {
  name: string;
  avatarUrl: string | null;
};

export type PublicTestimonial = {
  id: string;
  studentName: string;
  studentPhotoUrl: string | null;
  rating: number;
  message: string;
  createdAt: string;
};

export type PublicCourseDetail = Omit<AdminCourse, "createdBy"> & {
  creator: PublicCourseCreator;
  testimonials: PublicTestimonial[];
  modules: PublicModule[];
  _count: { enrollments: number };
  faqs?: PublicContentFaq[];
};

export type PaginatedCourses = {
  items: AdminCourse[];
  total: number;
  page: number;
  limit: number;
};

export type FeaturedCourseCard = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  instructor: string;
  instructorRole: string;
  instructorAvatar: string;
  level: string;
  duration: string;
  comingSoon?: boolean;
};

export type ListCoursesQuery = {
  page?: number;
  limit?: number;
  categoryId?: string;
  featured?: boolean;
  q?: string;
  level?: CourseLevel;
};

export type CreateCourseRequest = {
  title: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  thumbnailUrl: string;
  price: number;
  discountPrice?: number;
  currency?: string;
  level?: CourseLevel;
  isPublished?: boolean;
  isFeatured?: boolean;
  isComingSoon?: boolean;
  metaTitle?: string;
  metaDescription?: string;
};

export type UpdateCourseRequest = {
  title?: string;
  categoryId?: string;
  shortDescription?: string;
  description?: string;
  thumbnailUrl?: string;
  price?: number;
  discountPrice?: number | null;
  currency?: string;
  level?: CourseLevel | null;
  isPublished?: boolean;
  isFeatured?: boolean;
  isComingSoon?: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

export type CreateModuleRequest = {
  title: string;
  position?: number;
};

export type UpdateModuleRequest = {
  title?: string;
  position?: number;
};

export type CreateChapterRequest = {
  title: string;
  position?: number;
};

export type UpdateChapterRequest = {
  title?: string;
  position?: number;
};

export type CreateLessonRequest = {
  title: string;
  contentType: ContentType;
  videoStorageKey?: string;
  videoDurationSeconds?: number;
  fileStorageKey?: string;
  fileType?: string;
  textContent?: string;
  isPreview?: boolean;
  position?: number;
};

export type UpdateLessonRequest = {
  title?: string;
  contentType?: ContentType;
  videoStorageKey?: string | null;
  videoDurationSeconds?: number | null;
  fileStorageKey?: string | null;
  fileType?: string | null;
  textContent?: string | null;
  isPreview?: boolean;
  position?: number;
};

export type CreateLessonResourceRequest = {
  title: string;
  fileStorageKey: string;
  fileType: string;
};

export type ReorderRequest = {
  orderedIds: string[];
};

export type MessageResponse = {
  message: string;
};
