"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { isAdminWorkspace } from "@/components/admin/admin-ui";

const LABELS: Record<string, string> = {
  admin: "Dashboard",
  courses: "Courses",
  new: "New",
  edit: "Edit",
  categories: "Categories",
  blogs: "Blogs",
  songs: "Songs",
  users: "Students",
  purchases: "Purchases",
  enquiries: "Enquiries",
  analytics: "Analytics",
  site: "Homepage",
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export function AdminHeader() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const leaf = segments[segments.length - 1] ?? "admin";
  const leafLabel = isUuid(leaf)
    ? segments.includes("songs") || segments.includes("blogs")
      ? "Editor"
      : segments.includes("users")
        ? "Profile"
        : "Curriculum"
    : (LABELS[leaf] ?? leaf);

  if (isAdminWorkspace(pathname)) {
    return null;
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b border-border/70 bg-background/80 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-2 px-4 md:px-6">
        <SidebarTrigger className="-ml-1 text-brand-navy hover:bg-brand-teal/10 hover:text-brand-navy" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              {segments.length > 1 ? (
                <BreadcrumbLink
                  href="/admin"
                  className="text-muted-foreground hover:text-brand-navy"
                >
                  Dashboard
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="font-medium text-brand-navy">
                  Dashboard
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {segments.length > 1 ? (
              <>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium text-brand-navy">
                    {leafLabel}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : null}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
