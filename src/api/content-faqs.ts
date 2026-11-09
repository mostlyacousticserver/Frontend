import { api } from "@/lib/axios";
import type { MessageResponse } from "@/types/course";
import type {
  ContentFaq,
  CreateContentFaqRequest,
  ListContentFaqsQuery,
  UpdateContentFaqRequest,
} from "@/types/content-faq";

export const ContentFaqAPI = {
  listAdmin(query: ListContentFaqsQuery) {
    return api.get<ContentFaq[]>("/admin/content-faqs", { params: query });
  },

  create(payload: CreateContentFaqRequest) {
    return api.post<ContentFaq>("/admin/content-faqs", payload);
  },

  update(id: string, payload: UpdateContentFaqRequest) {
    return api.patch<ContentFaq>(`/admin/content-faqs/${id}`, payload);
  },

  remove(id: string) {
    return api.delete<MessageResponse>(`/admin/content-faqs/${id}`);
  },
};
