import type { ContentType } from "@/types/course";

export type StudentVideoStatus = "READY" | "PROCESSING" | "FAILED";

export type CourseAccess = {
  hasAccess: boolean;
  enrolledAt: string | null;
  expiresAt: string | null;
};

export type EnrolledResource = {
  id: string;
  lessonId: string;
  title: string;
  fileType: string;
  createdAt: string;
};

export type EnrolledLesson = {
  id: string;
  chapterId: string;
  title: string;
  contentType: ContentType;
  videoDurationSeconds: number | null;
  isPreview: boolean;
  position: number;
  hasVideo: boolean;
  hasFile: boolean;
  fileType: string | null;
  textContent: string | null;
  videoStatus: StudentVideoStatus | null;
  resources: EnrolledResource[];
};

export type EnrolledChapter = {
  id: string;
  moduleId: string;
  title: string;
  position: number;
  lessons: EnrolledLesson[];
};

export type EnrolledModule = {
  id: string;
  courseId: string;
  title: string;
  position: number;
  chapters: EnrolledChapter[];
};

export type EnrolledCourseContent = {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl: string;
  modules: EnrolledModule[];
};

export type LessonProgressItem = {
  lessonId: string;
  title: string;
  isCompleted: boolean;
  watchedSeconds: number;
  completedAt: string | null;
};

export type CourseProgress = {
  enrollmentId: string;
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  percentComplete: number;
  certificateIssued: boolean;
  continueLessonId: string | null;
  continueLessonTitle: string | null;
  lessons: LessonProgressItem[];
};

export type MyCourseItem = {
  enrollmentId: string;
  enrolledAt: string;
  orderId: string;
  certificateIssued: boolean;
  totalLessons: number;
  completedLessons: number;
  percentComplete: number;
  continueLessonId: string | null;
  continueLessonTitle: string | null;
  course: {
    id: string;
    title: string;
    slug: string;
    thumbnailUrl: string | null;
  };
};

export type MyCoursesResponse = {
  items: MyCourseItem[];
};

export type LessonMediaResponse = {
  lessonId: string;
  type: "video" | "file";
  url: string;
  expiresIn: number;
  source: "legacy" | "original";
};

export type ResourceDownloadResponse = {
  resourceId: string;
  title: string;
  fileType: string;
  url: string;
  expiresIn: number;
};

export type CertificateResponse = {
  id: string;
  enrollmentId: string;
  certificateNumber: string;
  issuedAt: string;
  downloadUrl: string;
  expiresIn: number;
};

export type UpdateLessonProgressRequest = {
  isCompleted?: boolean;
  watchedSeconds?: number;
};
