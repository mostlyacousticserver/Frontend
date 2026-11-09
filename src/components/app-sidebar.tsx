"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookOpen,
  FolderOpen,
  Gauge,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  MonitorPlay,
  Music2,
  Newspaper,
  ShoppingBag,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const contentNav = [
  {
    title: "Overview",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Homepage",
    url: "/admin/site",
    icon: MonitorPlay,
  },
  {
    title: "Courses",
    url: "/admin/courses",
    icon: BookOpen,
    items: [
      { title: "All courses", url: "/admin/courses" },
      { title: "New course", url: "/admin/courses/new" },
    ],
  },
  {
    title: "Categories",
    url: "/admin/categories",
    icon: FolderOpen,
  },
  {
    title: "Free Courses",
    url: "/admin/free-courses",
    icon: GraduationCap,
    items: [
      { title: "All free courses", url: "/admin/free-courses" },
      { title: "New free course", url: "/admin/free-courses/new" },
    ],
  },
  {
    title: "Blogs",
    url: "/admin/blogs",
    icon: Newspaper,
    items: [
      { title: "All blogs", url: "/admin/blogs" },
      { title: "New blog", url: "/admin/blogs/new" },
    ],
  },
  {
    title: "Songs",
    url: "/admin/songs",
    icon: Music2,
    items: [
      { title: "All songs", url: "/admin/songs" },
      { title: "New song", url: "/admin/songs/new" },
    ],
  },
];

const businessNav = [
  {
    title: "Students",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Purchases",
    url: "/admin/purchases",
    icon: ShoppingBag,
  },
  {
    title: "Enquiries",
    url: "/admin/enquiries",
    icon: Inbox,
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: Gauge,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="p-3 group-data-[collapsible=icon]:p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-white/10 data-[state=open]:bg-white/10"
            >
              <Link href="/admin">
                <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-orange to-brand-teal text-white shadow-[0_8px_20px_rgb(255_106_0_/_0.28)] group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:rounded-lg">
                  <BookOpen className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">Mostly Acoustic</span>
                  <span className="truncate text-[11px] tracking-[0.16em] text-brand-teal uppercase">
                    Admin studio
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2 group-data-[collapsible=icon]:px-0">
        <NavMain label="Content" items={contentNav} />
        <SidebarSeparator className="mx-0 bg-white/10 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:w-6" />
        <NavMain label="Business" items={businessNav} />
      </SidebarContent>
      <SidebarFooter className="border-t border-white/10 p-2">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
