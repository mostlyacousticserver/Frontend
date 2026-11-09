"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { RelatedCourse } from "@/data/course";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { adminCourseDashboardPath } from "@/lib/admin-paths";
import { isRemoteImage } from "@/lib/image";
import { courseEase, courseFadeUp } from "./motion";

type RelatedCoursesProps = {
  courses: RelatedCourse[];
};

export function RelatedCourses({ courses }: RelatedCoursesProps) {
  const { isAdmin } = useIsAdmin();
  if (courses.length === 0) return null;

  return (
    <motion.section
      {...courseFadeUp}
      className="mt-8 sm:mt-10 md:mt-12"
    >
      <h2 className="font-sans text-[18px] font-bold text-[#111111] sm:text-[22px] md:text-[24px]">
        Related Courses
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-3.5 sm:mt-5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.06, ease: courseEase }}
            whileHover={{ y: -4 }}
          >
            <Link
              href={
                isAdmin
                  ? adminCourseDashboardPath(course.id)
                  : `/courses/${course.slug}`
              }
              className="block overflow-hidden rounded-[14px] border border-[#E9EEF3] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_14px_32px_rgba(15,23,42,0.08)] sm:rounded-[18px]"
            >
              <div className="relative aspect-[16/10] bg-[#F3F4F6]">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  unoptimized={isRemoteImage(course.image)}
                />
              </div>
              <div className="p-3.5 sm:p-4">
                <span className="rounded-full bg-[#E6F8F5] px-2.5 py-1 font-sans text-[10px] font-semibold text-[#0DA694] sm:text-[11px]">
                  {course.level}
                </span>
                <h3 className="mt-2 font-sans text-[14px] font-bold leading-snug text-[#111111] sm:text-[15px]">
                  {course.title}
                </h3>
                <div className="mt-2 flex items-center justify-between gap-2">
                  {course.rating ? (
                    <span className="inline-flex items-center gap-1 font-sans text-[12px] text-[#6B7280] sm:text-[13px]">
                      <Star
                        size={12}
                        className="fill-amber-400 text-amber-400 sm:h-[13px] sm:w-[13px]"
                        aria-hidden
                      />
                      {course.rating}
                    </span>
                  ) : (
                    <span />
                  )}
                  <span className="font-sans text-[13px] font-bold text-[#111111] sm:text-[14px]">
                    ₹{course.price.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
