"use client";

import Link from "next/link";
import { useCourseAccess } from "@/hooks/useCourseAccess";
import { useIsAdmin } from "@/hooks/useIsAdmin";

type CourseEnrollCtaProps = {
  courseId: string;
  slug: string;
  className: string;
  enrollLabel?: string;
  continueLabel?: string;
  comingSoonLabel?: string;
  hasAccess?: boolean;
  ready?: boolean;
  comingSoon?: boolean;
};

export function CourseEnrollCta({
  courseId,
  slug,
  className,
  enrollLabel = "Enroll Now",
  continueLabel = "Continue learning",
  comingSoonLabel = "Coming Soon",
  hasAccess: hasAccessProp,
  ready: readyProp,
  comingSoon = false,
}: CourseEnrollCtaProps) {
  const { isAdmin, isHydrated } = useIsAdmin();
  const fetched = useCourseAccess(
    hasAccessProp === undefined && !isAdmin ? courseId : undefined,
  );
  const hasAccess = hasAccessProp ?? fetched.hasAccess;
  const ready = readyProp ?? fetched.ready;

  if (isHydrated && isAdmin) {
    return null;
  }

  if (comingSoon && !hasAccess) {
    return (
      <span
        className={`${className} pointer-events-none cursor-not-allowed bg-[#FF6B00] opacity-90 shadow-none hover:bg-[#FF6B00]`}
        aria-disabled
      >
        {comingSoonLabel}
      </span>
    );
  }

  if (!ready) {
    return (
      <span className={`${className} pointer-events-none opacity-70`} aria-hidden>
        {enrollLabel}
      </span>
    );
  }

  if (hasAccess) {
    return (
      <Link href={`/learn/${slug}`} className={className}>
        {continueLabel}
      </Link>
    );
  }

  return (
    <Link href={`/checkout/${slug}`} className={className}>
      {enrollLabel}
    </Link>
  );
}
