import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { CheckoutView } from "@/components/checkout/CheckoutView";
import {
  fetchPublishedCourse,
  publicCourseToViewModel,
} from "@/lib/public-course";
import { buildPageMetadata } from "@/lib/seo";

type CheckoutPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: CheckoutPageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await fetchPublishedCourse(slug);

  if (!course) {
    return buildPageMetadata({
      title: "Checkout",
      description: "Secure checkout for Mostly Acoustic courses.",
      path: `/checkout/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: `Checkout — ${course.title}`,
    description: `Secure checkout for ${course.title}. Get instant access after payment.`,
    path: `/checkout/${slug}`,
    noIndex: true,
  });
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { slug } = await params;
  const course = await fetchPublishedCourse(slug);

  if (!course) {
    notFound();
  }

  if (course.isComingSoon) {
    redirect(`/courses/${course.slug}`);
  }

  const view = publicCourseToViewModel(course);

  return (
    <main className="min-h-screen overflow-x-clip bg-[#F7F8FA]">
      <Navbar variant="light" />
      <CheckoutView course={view} />
      <footer className="border-t border-[#E9EEF3] bg-white px-4 py-4 sm:px-6 sm:py-5 md:px-8">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-1.5 font-sans text-[11px] text-[#9CA3AF] sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:text-[12px]">
          <p>© {new Date().getFullYear()} Mostly Acoustic — All rights reserved</p>
          <Link href="/#" className="hover:text-[#6B7280]">
            Privacy
          </Link>
        </div>
      </footer>
    </main>
  );
}
