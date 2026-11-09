"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CourseAPI } from "@/api/course";
import { CourseCard } from "@/components/CourseCard";
import { publishedCourseToCard } from "@/lib/public-course";
import type { FeaturedCourseCard } from "@/types/course";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
};

function useCarouselLayout() {
  const [visible, setVisible] = useState(3);
  const [gap, setGap] = useState(20);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisible(1);
        setGap(14);
      } else if (width < 768) {
        setVisible(1);
        setGap(16);
      } else if (width < 1024) {
        setVisible(2);
        setGap(18);
      } else {
        setVisible(3);
        setGap(20);
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return { visible, gap };
}

export function FeaturedCourses() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [courses, setCourses] = useState<FeaturedCourseCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const { visible: visibleCount, gap } = useCarouselLayout();
  const canCarousel = courses.length > visibleCount;
  const maxIndex = Math.max(0, courses.length - visibleCount);

  const canPrev = canCarousel && index > 0;
  const canNext = canCarousel && index < maxIndex;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    CourseAPI.listPublished({ featured: true, limit: 12 })
      .then(async (response) => {
        let items = response.data.items;
        if (items.length === 0) {
          const fallback = await CourseAPI.listPublished({ limit: 12 });
          items = fallback.data.items;
        }
        if (!cancelled) {
          setCourses(items.map(publishedCourseToCard));
        }
      })
      .catch(() => {
        if (!cancelled) setCourses([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      setSlideWidth((width - gap * (visibleCount - 1)) / visibleCount);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [visibleCount, gap, courses.length]);

  useEffect(() => {
    setIndex((current) => Math.min(current, maxIndex));
  }, [maxIndex]);

  return (
    <section id="courses" className="relative bg-white py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="mb-5 flex items-center justify-between gap-3 sm:mb-7 md:mb-8">
          <motion.h2
            {...fadeUp}
            className="font-montserrat text-[24px] font-bold uppercase tracking-[0.02em] text-[#1a1a1a] sm:text-[28px] md:text-[34px] lg:text-[38px]"
          >
            Featured Courses
          </motion.h2>

          <motion.div {...fadeUp} className="flex shrink-0 gap-1.5 sm:gap-2">
            <button
              type="button"
              aria-label="Previous courses"
              disabled={!canPrev}
              onClick={() => setIndex((value) => Math.max(0, value - 1))}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F1F2F4] text-[#333333] transition-all hover:bg-[#E6E8EB] disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:w-10 md:h-11 md:w-11"
            >
              <ArrowLeft size={16} className="sm:hidden" />
              <ArrowLeft size={18} className="hidden sm:block" />
            </button>
            <button
              type="button"
              aria-label="Next courses"
              disabled={!canNext}
              onClick={() => setIndex((value) => Math.min(maxIndex, value + 1))}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F1F2F4] text-[#333333] transition-all hover:bg-[#E6E8EB] disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:w-10 md:h-11 md:w-11"
            >
              <ArrowRight size={16} className="sm:hidden" />
              <ArrowRight size={18} className="hidden sm:block" />
            </button>
          </motion.div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: visibleCount }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-black/[0.06] bg-white p-0"
              >
                {/* Mirrors the real card so the layout doesn't jump on load. */}
                <div className="aspect-[5/2] rounded-t-2xl bg-[#F3F4F6]" />
                <div className="space-y-2.5 p-4">
                  <div className="h-7 w-2/3 rounded-full bg-[#F3F4F6]" />
                  <div className="h-3.5 w-full rounded bg-[#F3F4F6]" />
                  <div className="h-3 w-4/5 rounded bg-[#F3F4F6]" />
                  <div className="flex items-center justify-between pt-2">
                    <div className="h-5 w-20 rounded bg-[#F3F4F6]" />
                    <div className="h-8 w-20 rounded-lg bg-[#F3F4F6]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <p className="py-10 text-center font-sans text-[14px] text-gray-400">
            No published courses yet. Check back soon.
          </p>
        ) : (
          <div ref={containerRef} className="overflow-hidden">
            <motion.div
              className="flex"
              style={{ gap }}
              animate={{
                x: canCarousel && slideWidth ? -index * (slideWidth + gap) : 0,
              }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              drag={canCarousel ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.08}
              onDragEnd={(_, info) => {
                if (!canCarousel) return;
                if (info.offset.x < -50 && canNext) {
                  setIndex((value) => Math.min(maxIndex, value + 1));
                } else if (info.offset.x > 50 && canPrev) {
                  setIndex((value) => Math.max(0, value - 1));
                }
              }}
            >
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="min-w-0 shrink-0"
                  style={{
                    width: slideWidth || undefined,
                    flex: slideWidth
                      ? undefined
                      : `0 0 calc((100% - ${(visibleCount - 1) * gap}px) / ${visibleCount})`,
                  }}
                >
                  <CourseCard course={course} />
                </div>
              ))}
            </motion.div>
          </div>
        )}

        {canCarousel ? (
          <div className="mt-5 flex items-center justify-center gap-1.5 sm:mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, dotIndex) => (
              <button
                key={dotIndex}
                type="button"
                aria-label={`Go to slide ${dotIndex + 1}`}
                onClick={() => setIndex(dotIndex)}
                className={`h-1.5 rounded-full transition-all ${
                  index === dotIndex
                    ? "w-5 bg-brand-teal"
                    : "w-1.5 bg-[#D1D5DB] hover:bg-[#9CA3AF]"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div id="songs" className="sr-only" aria-hidden />
      <div id="blog" className="sr-only" aria-hidden />
    </section>
  );
}
