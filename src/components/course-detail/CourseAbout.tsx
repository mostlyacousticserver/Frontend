"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type {
  CourseFAQ,
  CourseInstructor,
  CourseReview,
} from "@/data/course";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { isRemoteImage } from "@/lib/image";
import { courseFadeUp } from "./motion";

type CourseAboutProps = {
  description?: string;
  instructor: CourseInstructor;
  reviews: CourseReview[];
  rating: string;
  reviewCount: string;
  faqs: CourseFAQ[];
};

export function CourseAbout({
  description,
  instructor,
  reviews,
  rating,
  reviewCount,
  faqs,
}: CourseAboutProps) {
  const instructorStats = [
    { label: "Experience", value: instructor.experience },
    { label: "Students", value: instructor.students },
    { label: "Rating", value: instructor.rating },
    { label: "Courses", value: instructor.courses },
  ].filter((stat) => Boolean(stat.value));

  return (
    <>
      {description ? (
        <motion.section
          {...courseFadeUp}
          className="rounded-[16px] border border-[#E9EEF3] bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,0.04)] sm:rounded-[20px] sm:p-5 md:p-6 lg:p-7"
        >
          <h2 className="font-sans text-[18px] font-bold text-[#111111] sm:text-[20px] md:text-[22px]">
            About This Course
          </h2>
          <p className="mt-3 whitespace-pre-wrap font-sans text-[13px] leading-6 text-[#4B5563] sm:mt-4 sm:text-[14px] sm:leading-7">
            {description}
          </p>
        </motion.section>
      ) : null}


      {reviews.length > 0 ? (
        <motion.section
          {...courseFadeUp}
          className="rounded-[16px] border border-[#E9EEF3] bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,0.04)] sm:rounded-[20px] sm:p-5 md:p-6 lg:p-7"
        >
          <div className="flex flex-wrap items-end justify-between gap-2 sm:gap-3">
            <h2 className="font-sans text-[18px] font-bold text-[#111111] sm:text-[20px] md:text-[22px]">
              Student Reviews
            </h2>
            {rating && reviewCount ? (
              <p className="inline-flex items-center gap-1.5 font-sans text-[12px] text-[#6B7280] sm:text-[14px]">
                <Star
                  size={14}
                  className="fill-amber-400 text-amber-400 sm:h-[15px] sm:w-[15px]"
                  aria-hidden
                />
                <span className="font-bold text-[#111111]">{rating}</span>
                <span>· {reviewCount} reviews</span>
              </p>
            ) : null}
          </div>

          <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">
            {reviews.map((review, index) => (
              <motion.article
                key={review.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="rounded-xl border border-[#E9EEF3] bg-[#F8FAFB] p-3.5 sm:rounded-2xl sm:p-4"
              >
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[#E5E7EB] sm:h-10 sm:w-10">
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                      unoptimized={isRemoteImage(review.avatar)}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
                      <p className="font-sans text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                        {review.name}
                      </p>
                      {review.date ? (
                        <p className="font-sans text-[11px] text-[#9CA3AF] sm:text-[12px]">
                          {review.date}
                        </p>
                      ) : null}
                    </div>
                    <div
                      className="mt-0.5 flex items-center gap-0.5"
                      aria-label={`${review.rating} stars`}
                    >
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={i}
                          size={11}
                          className="fill-amber-400 text-amber-400 sm:h-3 sm:w-3"
                          aria-hidden
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-2.5 font-sans text-[13px] leading-5 text-[#4B5563] sm:mt-3 sm:text-[14px] sm:leading-6">
                  {review.text}
                </p>
              </motion.article>
            ))}
          </div>
        </motion.section>
      ) : null}

      {faqs.length > 0 ? (
        <motion.section
          {...courseFadeUp}
          className="rounded-[16px] border border-[#E9EEF3] bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,0.04)] sm:rounded-[20px] sm:p-5 md:p-6 lg:p-7"
        >
          <h2 className="font-sans text-[18px] font-bold text-[#111111] sm:text-[20px] md:text-[22px]">
            Frequently Asked Questions
          </h2>

          <Accordion type="multiple" className="mt-3 w-full sm:mt-4">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="py-3 text-left text-[13px] sm:py-4 sm:text-[14px]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="font-sans text-[13px] leading-6 text-[#6B7280] sm:text-[14px] sm:leading-7">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.section>
      ) : null}
    </>
  );
}
