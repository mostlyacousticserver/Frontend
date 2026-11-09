import { api } from "@/lib/axios";
import type { MessageResponse } from "@/types/course";
import type {
  BlogDetail,
  CreateBlogRequest,
  ListBlogsQuery,
  PaginatedBlogs,
  UpdateBlogRequest,
} from "@/types/blog";

export const BlogAPI = {
  listPublished(query: ListBlogsQuery = {}) {
    return api.get<PaginatedBlogs>("/blogs", { params: query });
  },

  getPublished(slug: string) {
    return api.get<BlogDetail>(`/blogs/${slug}`);
  },

  listAdmin(query: ListBlogsQuery = {}) {
    return api.get<PaginatedBlogs>("/admin/blogs", { params: query });
  },

  getAdmin(id: string) {
    return api.get<BlogDetail>(`/admin/blogs/${id}`);
  },

  create(payload: CreateBlogRequest) {
    return api.post<BlogDetail>("/blogs", payload);
  },

  update(id: string, payload: UpdateBlogRequest) {
    return api.patch<BlogDetail>(`/blogs/${id}`, payload);
  },

  remove(id: string) {
    return api.delete<MessageResponse>(`/blogs/${id}`);
  },
};
