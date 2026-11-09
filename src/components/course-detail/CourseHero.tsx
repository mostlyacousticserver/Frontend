"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Bookmark, Share2, Star, Users } from "lucide-react";
import type { CourseDetail } from "@/data/course";
import { isRemoteImage } from "@/lib/image";
import { CourseEnrollCta } from "./CourseEnrollCta";
import { courseEase } from "./motion";

type CourseHeroProps = {
  course: CourseDetail;
};

export function CourseHero({ course }: CourseHeroProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        className="pt-6 sm:pt-8 md:pt-10"
      >
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 font-sans text-[13px] font-medium text-[#6B7280] transition-colors hover:text-[#111111] sm:gap-2 sm:text-[14px]"
        >
          <ArrowLeft size={15} className="sm:h-4 sm:w-4" aria-hidden />
          Back to Courses
        </Link>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: courseEase }}
        className="mt-4 overflow-hidden rounded-[16px] border border-[#E9EEF3] bg-white p-3 shadow-[0_10px_32px_rgba(15,23,42,0.05)] sm:mt-6 sm:rounded-[20px] sm:p-5 md:p-6 lg:p-8"
      >
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 lg:gap-8 xl:gap-10">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[12px] bg-[#F3F4F6] sm:aspect-[16/11] sm:rounded-[16px] md:rounded-[18px]">
            <Image
              src={course.image}
              alt={course.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
              quality={75}
              className="object-cover transition-transform duration-500 hover:scale-[1.02]"
              unoptimized={isRemoteImage(course.image)}
            />
          </div>

          <div className="flex flex-col">
            <span className="inline-flex w-fit rounded-full bg-[#E6F8F5] px-2.5 py-1 font-sans text-[11px] font-semibold text-[#0DA694] sm:px-3 sm:text-[12px]">
              {course.level}
            </span>

            <h1 className="mt-2.5 font-sans text-[22px] font-bold leading-[1.15] tracking-[-0.02em] text-[#111111] sm:mt-3 sm:text-[28px] md:text-[34px] lg:text-[40px]">
              {course.title}
            </h1>

            <p className="mt-2.5 font-sans text-[13px] leading-6 text-[#6B7280] sm:mt-3 sm:text-[14px] sm:leading-7 md:text-[15px] md:leading-8">
              {course.subtitle}
            </p>

            <div className="mt-4 flex items-center gap-2.5 sm:mt-5 sm:gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#F3F4F6] sm:h-12 sm:w-12">
                <Image
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                  unoptimized={isRemoteImage(course.instructor.avatar)}
                />
              </div>
              <div className="min-w-0">
                <p className="truncate font-sans text-[14px] font-semibold text-[#111111] sm:text-[15px]">
                  {course.instructor.name}
                </p>
                {course.instructor.role ? (
                  <p className="truncate font-sans text-[12px] text-[#9CA3AF] sm:text-[13px]">
                    {course.instructor.role}
                  </p>
                ) : null}
              </div>
            </div>

            {course.rating || course.enrolledCount ? (
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-sans text-[12px] text-[#6B7280] sm:mt-4 sm:gap-x-4 sm:gap-y-2 sm:text-[14px]">
                {course.rating ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Star
                      size={14}
                      className="fill-amber-400 text-amber-400 sm:h-4 sm:w-4"
                      aria-hidden
                    />
                    <span className="font-bold text-[#111111]">{course.rating}</span>
                    {course.reviewCount ? (
                      <span>({course.reviewCount} reviews)</span>
                    ) : null}
                  </span>
                ) : null}
                {course.enrolledCount ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Users size={14} className="sm:h-4 sm:w-4" aria-hidden />
                    <span>{course.enrolledCount} students</span>
                  </span>
                ) : null}
              </div>
            ) : null}

            {/* <div className="mt-4 flex items-center gap-2 sm:mt-5">
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                aria-label="Share course"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#E9EEF3] text-[#6B7280] transition-colors hover:border-brand-teal/40 hover:text-[#111111] sm:h-10 sm:w-10"
              >
                <Share2 size={15} />
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                aria-label="Save course"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#E9EEF3] text-[#6B7280] transition-colors hover:border-brand-teal/40 hover:text-[#111111] sm:h-10 sm:w-10"
              >
                <Bookmark size={15} />
              </motion.button>
            </div> */}

            <div className="mt-auto hidden pt-6 lg:block">
              <motion.div
                whileHover={{ y: -1, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <CourseEnrollCta
                  courseId={course.id}
                  slug={course.slug}
                  comingSoon={Boolean(course.comingSoon)}
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#11C5BB] px-5 font-sans text-[15px] font-semibold text-white shadow-[0_8px_20px_rgba(17,197,187,0.3)] transition-colors hover:bg-[#0fb0a7]"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
}
