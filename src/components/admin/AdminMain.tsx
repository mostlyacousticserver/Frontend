"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { isAdminWorkspace } from "@/components/admin/admin-ui";
import { cn } from "@/lib/utils";

export function AdminMain({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const workspace = isAdminWorkspace(pathname);

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col",
        workspace
          ? "overflow-hidden"
          : "gap-6 overflow-auto p-5 pt-5 md:p-8",
      )}
    >
      {children}
    </div>
  );
}
