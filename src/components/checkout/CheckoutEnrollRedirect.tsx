"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCourseAccess } from "@/hooks/useCourseAccess";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { adminCourseDashboardPath } from "@/lib/admin-paths";

export function CheckoutEnrollRedirect({
  courseId,
  slug,
}: {
  courseId: string;
  slug: string;
}) {
  const router = useRouter();
  const { isAdmin, isHydrated } = useIsAdmin();
  const { hasAccess, ready } = useCourseAccess(isAdmin ? undefined : courseId);

  useEffect(() => {
    if (!isHydrated) return;
    if (isAdmin) {
      router.replace(adminCourseDashboardPath(courseId));
      return;
    }
    if (ready && hasAccess) {
      router.replace(`/learn/${slug}`);
    }
  }, [courseId, hasAccess, isAdmin, isHydrated, ready, router, slug]);

  return null;
}
