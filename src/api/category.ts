import { api } from "@/lib/axios";
import type {
  Category,
  CategoryListItem,
  CreateCategoryRequest,
  DeleteCategoryResponse,
  UpdateCategoryRequest,
} from "@/types/category";

export const CategoryAPI = {
  list() {
    return api.get<CategoryListItem[]>("/categories");
  },

  create(payload: CreateCategoryRequest) {
    return api.post<Category>("/categories", payload);
  },

  update(id: string, payload: UpdateCategoryRequest) {
    return api.patch<Category>(`/categories/${id}`, payload);
  },

  remove(id: string) {
    return api.delete<DeleteCategoryResponse>(`/categories/${id}`);
  },
};
