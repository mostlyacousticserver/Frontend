import type { UserRole } from "@/types/auth";

export function isAdminRole(role?: UserRole | string | null): boolean {
  return role === "admin" || role === "super_admin";
}
