import type { User } from "@/types/auth";
import { isAdminRole } from "@/lib/roles";

export function getSafeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/";
  }

  return next;
}

function isStudentOnlyPath(path: string) {
  return (
    path.startsWith("/checkout") ||
    path.startsWith("/learn") ||
    path.startsWith("/learning")
  );
}

export function getPostLoginPath(
  user: User,
  next: string | null | undefined,
): string {
  const safeNext = getSafeNextPath(next);

  if (isAdminRole(user.role)) {
    if (safeNext === "/" || isStudentOnlyPath(safeNext)) {
      return "/admin";
    }
    return safeNext;
  }

  if (safeNext !== "/") {
    return safeNext;
  }

  return "/learning";
}

