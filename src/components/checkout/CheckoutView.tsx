"use client";

import type { CourseDetail } from "@/data/course";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { getCheckoutTestimonial } from "@/data/testimonials";
import { CheckoutSummary } from "./CheckoutSummary";
import { CheckoutEnrollRedirect } from "./CheckoutEnrollRedirect";
import { PaymentCard } from "./PaymentCard";

type CheckoutViewProps = {
  course: CourseDetail;
};

export function CheckoutView({ course }: CheckoutViewProps) {
  const { isAdmin, isHydrated } = useIsAdmin();

  return (
    <section className="overflow-x-clip bg-[#F7F8FA] pb-12 pt-[78px] sm:pb-16 md:pb-20">
      <CheckoutEnrollRedirect courseId={course.id} slug={course.slug} />
      {isHydrated && isAdmin ? null : (
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-5 px-4 pt-6 sm:gap-6 sm:px-6 sm:pt-8 md:px-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.9fr)] lg:items-start lg:gap-8 lg:pt-10 xl:gap-10">
          <div className="order-1 lg:order-2">
            <PaymentCard course={course} />
          </div>
          <div className="order-2 lg:order-1">
            <CheckoutSummary
              course={course}
              testimonial={getCheckoutTestimonial()}
            />
          </div>
        </div>
      )}
    </section>
  );
}
