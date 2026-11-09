"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Award,
  Clock3,
  Download,
  Dumbbell,
  GraduationCap,
  Infinity as InfinityIcon,
  Layers,
  MonitorSmartphone,
  Sparkles,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { CourseDetail } from "@/data/course";
import type { CheckoutTestimonial } from "@/data/testimonials";
import { checkoutIncludedFeatures } from "@/data/checkout";
import { isRemoteImage } from "@/lib/image";

const iconMap: Record<string, LucideIcon> = {
  clock: Clock3,
  layers: Layers,
  infinity: InfinityIcon,
  trophy: GraduationCap,
  download: Download,
  dumbbell: Dumbbell,
  award: Award,
  devices: MonitorSmartphone,
  users: Users,
  sparkles: Sparkles,
};

type CheckoutSummaryProps = {
  course: CourseDetail;
  testimonial: CheckoutTestimonial;
};

export function CheckoutSummary({ course, testimonial }: CheckoutSummaryProps) {
  const { instructor } = course;

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="font-sans text-[12px] font-medium text-gray-400 sm:text-[13px]">
          Secure checkout
        </p>
        <h1 className="mt-1.5 font-sans text-[22px] font-bold leading-tight tracking-[-0.02em] text-[#111111] sm:mt-2 sm:text-[28px] md:text-[32px] lg:text-[36px]">
          {course.title}
        </h1>
        <p className="mt-2.5 max-w-xl font-sans text-[13px] leading-6 text-[#6B7280] sm:mt-3 sm:text-[14px] sm:leading-7 md:text-[15px]">
          {course.subtitle}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="relative aspect-[16/9] w-full overflow-hidden rounded-[14px] bg-[#F3F4F6] shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:rounded-[18px]"
      >
        <Image
          src={course.image}
          alt={course.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          quality={75}
          className="object-cover"
          unoptimized={isRemoteImage(course.image)}
        />
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="rounded-[14px] border border-[#E9EEF3] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] sm:rounded-[18px] sm:p-5 md:p-6"
      >
        <h2 className="font-sans text-[16px] font-bold text-[#111111] sm:text-[18px]">
          What&apos;s included
        </h2>

        <ul className="mt-4 grid gap-3.5 sm:mt-5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-4">
          {checkoutIncludedFeatures.map((feature, index) => {
            const Icon = iconMap[feature.icon] ?? Sparkles;
            return (
              <motion.li
                key={feature.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className="flex items-start gap-3"
              >
                <span
                  className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-10 sm:w-10 ${feature.bg} ${feature.color}`}
                >
                  <Icon size={16} className="sm:h-[18px] sm:w-[18px]" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="font-sans text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                    {feature.title}
                  </p>
                  <p className="mt-0.5 font-sans text-[12px] leading-5 text-[#6B7280] sm:text-[13px]">
                    {feature.description}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3 rounded-[14px] border border-[#E9EEF3] bg-white p-3.5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_12px_28px_rgba(15,23,42,0.07)] sm:gap-3.5 sm:rounded-[18px] sm:p-4"
      >
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#F3F4F6] sm:h-14 sm:w-14">
          <Image
            src={instructor.avatar}
            alt={instructor.name}
            fill
            sizes="56px"
            className="object-cover"
            unoptimized={isRemoteImage(instructor.avatar)}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-sans text-[14px] font-semibold text-[#111111] sm:text-[15px]">
            {instructor.name}
          </p>
          <p className="truncate font-sans text-[12px] text-[#6B7280] sm:text-[13px]">
            {instructor.role}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-sans text-[11px] text-[#6B7280] sm:gap-x-3 sm:text-[12px]">
            <span className="inline-flex items-center gap-1">
              <Star
                size={11}
                className="fill-amber-400 text-amber-400 sm:h-3 sm:w-3"
                aria-hidden
              />
              {instructor.rating}
            </span>
            <span>{instructor.experience}</span>
            <span>{instructor.students} students</span>
            <span>{instructor.courses} courses</span>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="rounded-[14px] bg-gradient-to-br from-[#1B2B4B] to-[#152238] p-4 text-white shadow-[0_12px_32px_rgba(27,43,75,0.25)] sm:rounded-[18px] sm:p-5 md:p-6"
      >
        <div className="mb-2.5 flex gap-0.5 sm:mb-3" aria-label="5 star rating">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={13}
              className="fill-[#FBBF24] text-[#FBBF24] sm:h-3.5 sm:w-3.5"
              aria-hidden
            />
          ))}
        </div>
        <p className="font-sans text-[13px] italic leading-6 text-white/95 sm:text-[15px] sm:leading-7 md:text-[16px]">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
        <div className="mt-3.5 flex items-center gap-2.5 sm:mt-4">
          <div className="relative h-7 w-7 overflow-hidden rounded-full bg-white/20 sm:h-8 sm:w-8">
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>
          <p className="font-sans text-[12px] font-medium text-white/90 sm:text-[13px]">
            — {testimonial.name}
          </p>
        </div>
      </motion.section>
    </div>
  );
}
