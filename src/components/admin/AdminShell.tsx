"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SidebarInset } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

function isSongWorkspace(pathname: string) {
  if (pathname === "/admin/songs/new") return true;
  return /^\/admin\/songs\/[0-9a-f-]{36}$/i.test(pathname);
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const songWorkspace = isSongWorkspace(pathname);

  return (
    <SidebarInset
      className={cn(
        "bg-background",
        songWorkspace && "h-svh min-h-0 overflow-hidden",
      )}
    >
      {children}
    </SidebarInset>
  );
}
