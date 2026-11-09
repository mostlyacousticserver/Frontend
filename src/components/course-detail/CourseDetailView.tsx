"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { CourseDetail } from "@/data/course";
import { CourseHero } from "./CourseHero";
import { CourseContent } from "./CourseContent";
import { CourseAbout } from "./CourseAbout";
import { CoursePricingCard } from "./CoursePricingCard";
import { CourseEnrollCta } from "./CourseEnrollCta";
import { RelatedCourses } from "./RelatedCourses";
import { useCourseAccess } from "@/hooks/useCourseAccess";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { adminCourseDashboardPath } from "@/lib/admin-paths";
import { motion } from "framer-motion";

type CourseDetailViewProps = {
  course: CourseDetail;
};

export function CourseDetailView({ course }: CourseDetailViewProps) {
  const router = useRouter();
  const { pricing } = course;
  const { isAdmin, isHydrated } = useIsAdmin();
  const access = useCourseAccess(isAdmin ? undefined : course.id);

  useEffect(() => {
    if (isHydrated && isAdmin) {
      router.replace(adminCourseDashboardPath(course.id));
    }
  }, [course.id, isAdmin, isHydrated, router]);

  if (isHydrated && isAdmin) {
    return null;
  }

  return (
    <div className="overflow-x-clip bg-white pb-24 pt-3 sm:pb-16 md:pb-20 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-10">
        <CourseHero course={course} />

        <div className="mt-6 grid items-start gap-5 sm:mt-8 sm:gap-6 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-7 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-8">
          {/* Pricing first on mobile for clearer conversion path */}
          <div className="order-1 lg:order-2">
            <CoursePricingCard
              course={course}
              hasAccess={access.hasAccess}
              accessReady={access.ready}
            />
          </div>

          <div className="order-2 space-y-4 sm:space-y-5 md:space-y-6 lg:order-1">
            <CourseAbout
              description={course.description}
              instructor={course.instructor}
              reviews={course.reviews}
              rating={course.rating}
              reviewCount={course.reviewCount}
              faqs={course.faqs}
            />

            <CourseContent
              learningPoints={course.learningPoints}
              modules={course.modules}
              outline={course.outline}
              requirements={course.requirements}
              audience={course.audience}
            />
          </div>
        </div>

        <RelatedCourses courses={course.relatedCourses} />
      </div>

      <div
        data-sticky-bottom-bar
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E9EEF3] bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-1.5">
              <p className="font-sans text-[18px] font-bold leading-none text-[#111111]">
                {pricing.currency}
                {pricing.price.toLocaleString("en-IN")}
              </p>
              {pricing.discountPercent > 0 &&
              pricing.originalPrice > pricing.price ? (
                <p className="font-sans text-[12px] text-[#9CA3AF] line-through">
                  {pricing.currency}
                  {pricing.originalPrice.toLocaleString("en-IN")}
                </p>
              ) : null}
            </div>
            {pricing.offerLabel ? (
              <p className="mt-1 truncate font-sans text-[11px] font-medium text-[#0DA694]">
                {pricing.offerLabel}
              </p>
            ) : null}
          </div>
          <motion.div whileTap={{ scale: 0.98 }} className="shrink-0">
            <CourseEnrollCta
              courseId={course.id}
              slug={course.slug}
              hasAccess={access.hasAccess}
              ready={access.ready}
              comingSoon={Boolean(course.comingSoon)}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#11C5BB] px-5 font-sans text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(17,197,187,0.3)]"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
