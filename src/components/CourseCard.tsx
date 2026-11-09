"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock3 } from "lucide-react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { adminCourseDashboardPath } from "@/lib/admin-paths";
import type { FeaturedCourseCard } from "@/types/course";
import { isRemoteImage } from "@/lib/image";

type CourseCardProps = {
  course: FeaturedCourseCard;
  /**
   * Set on the cards that land above the fold. Their thumbnail is usually the
   * LCP element, and lazy-loading it holds the paint back until layout settles.
   */
  priority?: boolean;
};

export type FeaturedCourse = FeaturedCourseCard;

export function CourseCard({ course, priority = false }: CourseCardProps) {
  const { isAdmin, isHydrated } = useIsAdmin();
  const comingSoon = Boolean(course.comingSoon);
  const image = course.image || "/images/course-1.jpg";
  const avatar = course.instructorAvatar || "/images/pr1.jpeg";
  const adminView = isHydrated && isAdmin;
  // Admins go to the dashboard for the course; everyone else sees it locked
  // until it launches.
  const locked = comingSoon && !adminView;
  const cardHref = adminView
    ? adminCourseDashboardPath(course.id)
    : `/courses/${course.slug}`;

  // Every row below is driven by what the API actually returned — nothing is
  // filled in with a placeholder value, so a field the server leaves empty
  // simply doesn't render.
  const role = course.instructorRole?.trim();
  const description = course.description?.trim();
  const level = course.level?.trim();
  const duration = course.duration?.trim();

  const body = (
    <motion.article
      whileHover={locked ? undefined : { y: -4 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-black/[0.07] bg-white shadow-[0_1px_2px_rgba(17,17,17,0.04),0_10px_28px_rgba(17,17,17,0.07)] transition-colors duration-300 hover:border-brand-teal/35 sm:rounded-2xl"
    >
      {/*
        Sits outside the blurred wrapper below so the badge itself stays sharp,
        centred over a softened card.
      */}
      {locked ? (
        <span className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF6B00] px-3 py-1 font-sans text-[10.5px] font-semibold whitespace-nowrap text-white shadow-[0_8px_20px_rgba(255,107,0,0.35)] sm:px-3.5 sm:text-[11px]">
          Coming Soon
        </span>
      ) : null}

      <div
        className={`flex h-full flex-col ${
          locked ? "pointer-events-none select-none opacity-45 blur-[1px]" : ""
        }`}
      >
        {/* The zoom rides on the image itself, so the frame needs no inner
            wrapper — and the thumbnail always covers it, so no backdrop. */}
        <div className="relative aspect-[5/2] overflow-hidden">
          <Image
            src={image}
            alt={course.title}
            fill
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-transform duration-500 ${
              locked ? "" : "group-hover:scale-105"
            }`}
            unoptimized={isRemoteImage(image)}
          />
        </div>

        <div className="flex items-center gap-2 px-3 pb-2.5 pt-2.5 sm:gap-2.5 sm:px-3.5 sm:pt-3">
          <Image
            src={avatar}
            alt={course.instructor}
            width={40}
            height={40}
            loading="lazy"
            className="h-7 w-7 shrink-0 rounded-full object-cover ring-1 ring-black/[0.06] sm:h-8 sm:w-8"
            unoptimized={isRemoteImage(avatar)}
          />
          <div className="min-w-0">
            <p className="truncate font-sans text-[11.5px] font-semibold text-[#1a1a1a] sm:text-[12px]">
              {course.instructor}
            </p>
            {role ? (
              <p className="truncate font-sans text-[10px] text-gray-400 sm:text-[10.5px]">
                {role}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mx-3 border-t border-black/[0.07] sm:mx-3.5" />

        <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5 sm:px-3.5 sm:pb-3.5">
          {/* Clamped so a long title can't push the footer out of alignment. */}
          <h3 className="line-clamp-2 font-sans text-[13.5px] font-bold leading-snug text-[#111111] sm:text-[14.5px]">
            {course.title}
          </h3>
          {description ? (
            <p className="mt-1 line-clamp-2 font-sans text-[11.5px] leading-[18px] text-gray-500 sm:text-[12px]">
              {description}
            </p>
          ) : null}

          {/*
            Absorbs the leftover height so footers stay aligned across cards,
            while `min-h-3` keeps a gap above the rule on the tallest card —
            `mt-auto` alone collapses to zero there and the description ends up
            sitting on the line.
          */}
          <div className="min-h-2.5 flex-1" aria-hidden />

          {/* Level, duration and the CTA all share this row. */}
          <div className="border-t border-black/[0.07] pt-2.5">
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div className="flex min-w-0 items-center gap-2">
                {level ? (
                  <span className="shrink-0 rounded bg-[#E6F8F5] px-2 py-0.5 font-sans text-[10px] font-semibold text-brand-teal">
                    {level}
                  </span>
                ) : null}
                {duration ? (
                  <span className="flex min-w-0 items-center gap-1 text-gray-400">
                    <Clock3 size={12} className="shrink-0" aria-hidden />
                    <span className="truncate font-sans text-[11px] sm:text-[11.5px]">
                      {duration}
                    </span>
                  </span>
                ) : null}
              </div>

              {adminView ? (
                <span className="inline-flex h-8 items-center justify-center rounded-lg bg-brand-teal px-4 font-sans text-[12px] font-semibold text-white shadow-[0_6px_16px_rgba(45,212,191,0.3)] sm:text-[12.5px]">
                  Open
                </span>
              ) : locked ? (
                <span className="inline-flex h-8 items-center justify-center rounded-lg bg-brand-teal px-4 font-sans text-[12px] font-semibold text-white sm:text-[12.5px]">
                  Enroll
                </span>
              ) : (
                <motion.a
                  href={cardHref}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex h-8 items-center justify-center rounded-lg bg-brand-teal px-4 font-sans text-[12px] font-semibold text-white shadow-[0_6px_16px_rgba(45,212,191,0.3)] transition-colors hover:bg-brand-teal-hover sm:text-[12.5px]"
                >
                  Enroll
                </motion.a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );

  if (adminView) {
    return (
      <Link href={cardHref} className="block h-full">
        {body}
      </Link>
    );
  }

  return body;
}
