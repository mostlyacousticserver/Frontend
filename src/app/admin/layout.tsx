import type { Metadata } from "next";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminMain } from "@/components/admin/AdminMain";
import { AdminShell } from "@/components/admin/AdminShell";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { NOINDEX_ROBOTS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Admin",
  description: "Manage courses, videos, and content for Mostly Acoustic.",
  robots: NOINDEX_ROBOTS,
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminGuard>
      <SidebarProvider className="admin-app">
        <AppSidebar />
        <AdminShell>
          <AdminHeader />
          <AdminMain>{children}</AdminMain>
        </AdminShell>
      </SidebarProvider>
    </AdminGuard>
  );
}
