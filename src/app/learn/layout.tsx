import type { Metadata } from "next";
import { StudentGuard } from "@/components/learning/StudentGuard";
import { NOINDEX_ROBOTS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Course player",
  description: "Watch your Mostly Acoustic course.",
  robots: NOINDEX_ROBOTS,
};

export default function LearnLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StudentGuard>
      <div className="min-h-svh bg-[#F5F7F9] text-[#111111]">{children}</div>
    </StudentGuard>
  );
}
