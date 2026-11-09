"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { isAdminRole } from "@/lib/roles";
import { Skeleton } from "@/components/ui/skeleton";

export function StudentGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isHydrated } = useAuth();

  useEffect(() => {
    if (!isHydrated) return;
    if (isAdminRole(user?.role)) {
      router.replace("/admin");
      return;
    }
    if (!isAuthenticated) {
      const next = pathname && pathname !== "/" ? pathname : "/learning";
      router.replace(`/login?next=${encodeURIComponent(next)}`);
    }
  }, [isAuthenticated, isHydrated, pathname, router, user?.role]);

  if (!isHydrated || !isAuthenticated || isAdminRole(user?.role)) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#F7F8FA] p-6">
        <div className="w-full max-w-sm space-y-3">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  return children;
}
