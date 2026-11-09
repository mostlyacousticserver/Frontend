import type { Metadata } from "next";
import { StudentGuard } from "@/components/learning/StudentGuard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NOINDEX_ROBOTS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "My learning",
  description: "Courses you are enrolled in at Mostly Acoustic.",
  robots: NOINDEX_ROBOTS,
};

export default function LearningLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StudentGuard>
      <main className="min-h-screen overflow-x-clip bg-[#F7F8FA]">
        <Navbar variant="light" />
        {children}
        <Footer />
      </main>
    </StudentGuard>
  );
}
