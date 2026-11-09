import { api } from "@/lib/axios";
import type {
  AdminCourse,
  AdminCourseDetail,
  CreateChapterRequest,
  CreateCourseRequest,
  CreateLessonRequest,
  CreateLessonResourceRequest,
  CreateModuleRequest,
  Lesson,
  LessonResource,
  ListCoursesQuery,
  MessageResponse,
  PaginatedCourses,
  PublicCourseDetail,
  ReorderRequest,
  UpdateChapterRequest,
  UpdateCourseRequest,
  UpdateLessonRequest,
  UpdateModuleRequest,
  Chapter,
  CourseModule,
} from "@/types/course";

export const CourseAPI = {
  listPublished(query: ListCoursesQuery = {}) {
    return api.get<PaginatedCourses>("/courses", {
      params: query,
      skipErrorToast: true,
    });
  },

  getPublished(slug: string) {
    return api.get<PublicCourseDetail>(`/courses/${slug}`);
  },

  listAdmin(query: ListCoursesQuery = {}) {
    return api.get<PaginatedCourses>("/admin/courses", { params: query });
  },

  getAdmin(id: string) {
    return api.get<AdminCourseDetail>(`/admin/courses/${id}`);
  },

  create(payload: CreateCourseRequest) {
    return api.post<AdminCourse>("/courses", payload);
  },

  update(id: string, payload: UpdateCourseRequest) {
    return api.patch<AdminCourse>(`/courses/${id}`, payload);
  },

  remove(id: string) {
    return api.delete<MessageResponse>(`/courses/${id}`);
  },

  reorder(payload: ReorderRequest) {
    return api.patch<MessageResponse>("/admin/courses/reorder", payload);
  },
};

export const CourseContentAPI = {
  createModule(courseId: string, payload: CreateModuleRequest) {
    return api.post<CourseModule>(`/courses/${courseId}/modules`, payload);
  },

  updateModule(id: string, payload: UpdateModuleRequest) {
    return api.patch<CourseModule>(`/modules/${id}`, payload);
  },

  deleteModule(id: string) {
    return api.delete<MessageResponse>(`/modules/${id}`);
  },

  reorderModules(courseId: string, payload: ReorderRequest) {
    return api.patch<MessageResponse>(
      `/courses/${courseId}/modules/reorder`,
      payload,
    );
  },

  createChapter(moduleId: string, payload: CreateChapterRequest) {
    return api.post<Chapter>(`/modules/${moduleId}/chapters`, payload);
  },

  updateChapter(id: string, payload: UpdateChapterRequest) {
    return api.patch<Chapter>(`/chapters/${id}`, payload);
  },

  deleteChapter(id: string) {
    return api.delete<MessageResponse>(`/chapters/${id}`);
  },

  reorderChapters(moduleId: string, payload: ReorderRequest) {
    return api.patch<MessageResponse>(
      `/modules/${moduleId}/chapters/reorder`,
      payload,
    );
  },

  createLesson(chapterId: string, payload: CreateLessonRequest) {
    return api.post<Lesson>(`/chapters/${chapterId}/lessons`, payload);
  },

  updateLesson(id: string, payload: UpdateLessonRequest) {
    return api.patch<Lesson>(`/lessons/${id}`, payload);
  },

  deleteLesson(id: string) {
    return api.delete<MessageResponse>(`/lessons/${id}`);
  },

  reorderLessons(chapterId: string, payload: ReorderRequest) {
    return api.patch<MessageResponse>(
      `/chapters/${chapterId}/lessons/reorder`,
      payload,
    );
  },

  createResource(lessonId: string, payload: CreateLessonResourceRequest) {
    return api.post<LessonResource>(`/lessons/${lessonId}/resources`, payload);
  },

  deleteResource(id: string) {
    return api.delete<MessageResponse>(`/resources/${id}`);
  },
};
