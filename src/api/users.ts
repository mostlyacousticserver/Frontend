import { api } from "@/lib/axios";
import type {
  AdminUser,
  AdminUserDetail,
  ListAdminUsersQuery,
  PaginatedAdminUsers,
} from "@/types/admin";

export const UsersAPI = {
  listAdmin(query: ListAdminUsersQuery = {}) {
    return api.get<PaginatedAdminUsers>("/admin/users", { params: query });
  },

  getAdmin(id: string) {
    return api.get<AdminUserDetail>(`/admin/users/${id}`);
  },

  disable(id: string) {
    return api.patch<AdminUser>(`/admin/users/${id}/disable`);
  },

  enable(id: string) {
    return api.patch<AdminUser>(`/admin/users/${id}/enable`);
  },

  updateRole(id: string, role: AdminUser["role"]) {
    return api.patch<AdminUser>(`/admin/users/${id}/role`, { role });
  },
};
