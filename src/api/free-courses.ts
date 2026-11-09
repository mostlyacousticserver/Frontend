import { api } from "@/lib/axios";
import type { MessageResponse } from "@/types/course";
import type {
  CreateFreeCourseRequest,
  FreeCourseDetail,
  ListFreeCoursesQuery,
  PaginatedFreeCourses,
  UpdateFreeCourseRequest,
} from "@/types/free-course";

export const FreeCourseAPI = {
  listPublished(query: ListFreeCoursesQuery = {}) {
    return api.get<PaginatedFreeCourses>("/free-courses", { params: query });
  },

  getPublished(slug: string) {
    return api.get<FreeCourseDetail>(`/free-courses/${slug}`);
  },

  listAdmin(query: ListFreeCoursesQuery = {}) {
    return api.get<PaginatedFreeCourses>("/admin/free-courses", {
      params: query,
    });
  },

  getAdmin(id: string) {
    return api.get<FreeCourseDetail>(`/admin/free-courses/${id}`);
  },

  create(payload: CreateFreeCourseRequest) {
    return api.post<FreeCourseDetail>("/free-courses", payload);
  },

  update(id: string, payload: UpdateFreeCourseRequest) {
    return api.patch<FreeCourseDetail>(`/free-courses/${id}`, payload);
  },

  remove(id: string) {
    return api.delete<MessageResponse>(`/free-courses/${id}`);
  },
};
