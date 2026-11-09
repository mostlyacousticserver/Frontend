import { api } from "@/lib/axios";
import type {
  CertificateResponse,
  CourseAccess,
  CourseProgress,
  EnrolledCourseContent,
  LessonMediaResponse,
  MyCoursesResponse,
  ResourceDownloadResponse,
  UpdateLessonProgressRequest,
} from "@/types/learning";

export const LearningAPI = {
  listMyCourses() {
    return api.get<MyCoursesResponse>("/me/courses");
  },

  getAccess(courseId: string) {
    return api.get<CourseAccess>(`/courses/${courseId}/access`, {
      skipErrorToast: true,
    });
  },

  getContent(courseId: string, skipErrorToast = false) {
    return api.get<EnrolledCourseContent>(`/courses/${courseId}/content`, {
      skipErrorToast,
    });
  },

  getProgress(courseId: string, skipErrorToast = false) {
    return api.get<CourseProgress>(`/courses/${courseId}/progress`, {
      skipErrorToast,
    });
  },

  updateProgress(
    courseId: string,
    lessonId: string,
    payload: UpdateLessonProgressRequest,
  ) {
    return api.post(`/courses/${courseId}/lessons/${lessonId}/progress`, payload, {
      skipErrorToast: true,
    });
  },

  getLessonMedia(lessonId: string, type: "video" | "file", skipErrorToast = false) {
    return api.get<LessonMediaResponse>(`/lessons/${lessonId}/media`, {
      params: { type },
      skipErrorToast,
    });
  },

  getResourceDownload(resourceId: string) {
    return api.get<ResourceDownloadResponse>(`/resources/${resourceId}/download`);
  },

  getCertificate(courseId: string) {
    return api.get<CertificateResponse>(`/courses/${courseId}/certificate`, {
      skipErrorToast: true,
    });
  },
};
