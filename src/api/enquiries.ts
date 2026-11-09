import { api } from "@/lib/axios";
import type {
  AdminEnquiry,
  CreateEnquiryRequest,
  CreateEnquiryResponse,
  ListAdminEnquiriesQuery,
  PaginatedAdminEnquiries,
} from "@/types/admin";

export const EnquiriesAPI = {
  create(payload: CreateEnquiryRequest) {
    return api.post<CreateEnquiryResponse>("/enquiries", payload);
  },

  listAdmin(query: ListAdminEnquiriesQuery = {}) {
    return api.get<PaginatedAdminEnquiries>("/admin/enquiries", {
      params: query,
    });
  },

  getAdmin(id: string) {
    return api.get<AdminEnquiry>(`/admin/enquiries/${id}`);
  },

  updateRead(id: string, isRead: boolean) {
    return api.patch<AdminEnquiry>(`/admin/enquiries/${id}`, { isRead });
  },
};
