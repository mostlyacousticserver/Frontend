import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { PaymentSuccessScreen } from "@/components/checkout/PaymentSuccessScreen";
import {
  fetchPublishedCourse,
  publicCourseToViewModel,
} from "@/lib/public-course";
import { buildPageMetadata } from "@/lib/seo";

type SuccessPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    orderNumber?: string;
    orderId?: string;
    amount?: string;
    name?: string;
    email?: string;
  }>;
};

export async function generateMetadata({
  params,
}: SuccessPageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await fetchPublishedCourse(slug);

  return buildPageMetadata({
    title: course
      ? `Payment Successful — ${course.title}`
      : "Payment Successful",
    description: "Your Mostly Acoustic enrollment is confirmed.",
    path: `/checkout/${slug}/success`,
    noIndex: true,
  });
}

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: SuccessPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const course = await fetchPublishedCourse(slug);

  if (!course) {
    notFound();
  }

  const view = publicCourseToViewModel(course);
  const orderNumber = query.orderNumber?.trim() || query.orderId?.trim();
  const amount = query.amount ?? String(view.pricing.price);
  const purchaseDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen overflow-x-clip bg-[#F7F8FA]">
      <Navbar variant="light" />
      <PaymentSuccessScreen
        courseTitle={view.title}
        courseSlug={view.slug}
        orderId={orderNumber || "Pending confirmation"}
        amount={amount}
        currency={view.pricing.currency}
        purchaseDate={purchaseDate}
        customerName={query.name}
        customerEmail={query.email?.trim()}
      />
    </main>
  );
}
