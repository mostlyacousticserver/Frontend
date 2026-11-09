"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ListFilter } from "lucide-react";
import { CourseAPI } from "@/api/course";
import { CourseCard } from "@/components/CourseCard";
import { publishedCourseToCard } from "@/lib/public-course";
import type { CourseLevel, FeaturedCourseCard } from "@/types/course";

const ease = [0.22, 1, 0.36, 1] as const;
const PAGE_SIZE = 8;

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.4, ease },
};

const LEVEL_TABS = [
  { label: "All", value: "all" },
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Pro", value: "advanced" },
] as const;

type LevelTab = (typeof LEVEL_TABS)[number]["value"];

type CoursesPageProps = {
  /** First page rendered on the server so the catalogue is in the initial HTML. */
  initialCourses?: FeaturedCourseCard[];
  initialTotal?: number;
};

export function CoursesPage({
  initialCourses = [],
  initialTotal = 0,
}: CoursesPageProps = {}) {
  const [activeLevel, setActiveLevel] = useState<LevelTab>("all");
  const [courses, setCourses] = useState<FeaturedCourseCard[]>(initialCourses);
  const [total, setTotal] = useState(initialTotal);
  const [counts, setCounts] = useState<Record<LevelTab, number>>({
    all: initialTotal,
    beginner: 0,
    intermediate: 0,
    advanced: 0,
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(initialCourses.length === 0);
  // True until the server-rendered first page has been consumed once.
  const serverRendered = useRef(initialCourses.length > 0);
  const hasMore = courses.length < total;

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      CourseAPI.listPublished({ page: 1, limit: 1 }),
      ...LEVEL_TABS.filter((tab) => tab.value !== "all").map((tab) =>
        CourseAPI.listPublished({
          level: tab.value as CourseLevel,
          page: 1,
          limit: 1,
        }),
      ),
    ])
      .then((responses) => {
        if (cancelled) return;
        setCounts({
          all: responses[0].data.total,
          beginner: responses[1].data.total,
          intermediate: responses[2].data.total,
          advanced: responses[3].data.total,
        });
      })
      .catch(() => {
        // interceptor
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // The unfiltered first page already came from the server; refetching it on
    // mount would only duplicate work and flash the skeleton.
    if (serverRendered.current && page === 1 && activeLevel === "all") {
      serverRendered.current = false;
      return;
    }

    let cancelled = false;
    setLoading(true);
    CourseAPI.listPublished({
      level: activeLevel === "all" ? undefined : (activeLevel as CourseLevel),
      page,
      limit: PAGE_SIZE,
    })
      .then((response) => {
        if (cancelled) return;
        const cards = response.data.items.map(publishedCourseToCard);
        setCourses((current) => (page === 1 ? cards : [...current, ...cards]));
        setTotal(response.data.total);
        setCounts((current) => ({
          ...current,
          [activeLevel]: response.data.total,
        }));
      })
      .catch(() => {
        if (!cancelled && page === 1) setCourses([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeLevel, page]);

  function selectLevel(level: LevelTab) {
    serverRendered.current = false;
    setActiveLevel(level);
    setPage(1);
    setCourses([]);
    setLoading(true);
  }

  const activeLabel =
    LEVEL_TABS.find((tab) => tab.value === activeLevel)?.label ?? "All";

  return (
    <section className="overflow-x-clip bg-white pb-12 pt-3 sm:pb-16 md:pb-20 lg:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
          className="pt-8 sm:pt-10 md:pt-12 lg:pt-14"
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full bg-brand-teal sm:h-2 sm:w-2"
              aria-hidden
            />
            <p className="font-sans text-[12px] font-medium text-gray-400 sm:text-[13px]">
              (Trusted by 10M+ learners worldwide)
            </p>
          </div>

          <h1 className="mt-3 font-sans text-[28px] font-bold uppercase leading-[1.05] tracking-[-0.02em] text-[#111111] sm:mt-4 sm:text-[40px] md:text-[52px] lg:text-[64px]">
            Our Courses
          </h1>

          <p className="mt-3 max-w-[620px] font-sans text-[13px] leading-6 text-[#6B7280] sm:mt-4 sm:text-[14px] sm:leading-7 md:text-[16px] md:leading-8">
            A structured, beginner-to-intermediate guitar course by multi-platinum artist Marcus Reed. Eight modules, 42+ hours of HD video, and a step-by-step roadmap — from your very first chord to performing full songs in 30 days.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease }}
          className="mt-8 border-b border-[#E9EEF3] md:mt-10"
        >
          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-end md:justify-between">
            <div className="relative -mx-4 sm:mx-0">
              <div
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-white to-transparent sm:hidden"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-white to-transparent sm:hidden"
                aria-hidden
              />
              <div
                role="tablist"
                aria-label="Course levels"
                className="flex gap-5 overflow-x-auto px-4 pb-px [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-6 sm:px-0 md:gap-8 [&::-webkit-scrollbar]:hidden"
              >
                {LEVEL_TABS.map((tab) => {
                  const active = activeLevel === tab.value;
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => selectLevel(tab.value)}
                      className={`relative shrink-0 pb-3 font-sans text-[13px] font-semibold transition-colors sm:text-[14px] md:text-[15px] ${
                        active
                          ? "text-[#111111]"
                          : "text-gray-400 hover:text-[#6B7280]"
                      }`}
                    >
                      {tab.label}
                      <span className="ml-1.5 font-sans text-[11px] font-medium text-gray-400 sm:text-[12px]">
                        ({counts[tab.value]})
                      </span>
                      {active ? (
                        <motion.span
                          layoutId="courses-tab-underline"
                          className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-teal"
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* <div className="flex items-center justify-between gap-3 pb-3 sm:justify-start sm:gap-4 md:gap-5">
              <button
                type="button"
                className="inline-flex min-w-0 items-center gap-1 font-sans text-[12px] font-medium text-[#6B7280] transition-colors hover:text-[#111111] sm:gap-1.5 sm:text-[13px]"
              >
                <span className="truncate">
                  Sort by:{" "}
                  <span className="font-semibold text-[#111111]">
                    Most Popular
                  </span>
                </span>
                <ChevronDown size={15} className="shrink-0" aria-hidden />
              </button>

              <button
                type="button"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#E9EEF3] px-2.5 py-1.5 font-sans text-[12px] font-medium text-[#6B7280] transition-colors hover:border-brand-teal/40 hover:text-[#111111] sm:px-3 sm:text-[13px]"
              >
                <ListFilter size={14} aria-hidden />
                Filter
              </button>
            </div> */}
          </div>
        </motion.div>

        <motion.div
          {...fadeUp}
          className="mt-6 flex flex-wrap items-center gap-2.5 sm:mt-8 sm:gap-3 md:mt-10"
        >
          <h2 className="font-sans text-[18px] font-bold text-[#111111] sm:text-[22px] md:text-[28px]">
            {activeLabel} Courses
          </h2>
          <span className="rounded-full bg-[#E6F8F5] px-2.5 py-0.5 font-sans text-[11px] font-semibold text-brand-teal sm:px-3 sm:py-1 sm:text-[12px]">
            {total} {total === 1 ? "course" : "courses"}
          </span>
        </motion.div>

        {loading && courses.length === 0 ? (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
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
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLevel}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease }}
              className="mt-5 grid grid-cols-1 gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:grid-cols-3 xl:grid-cols-4"
            >
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.05, ease }}
                  className="h-full"
                >
                  <CourseCard course={course} priority={index < 4} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && courses.length === 0 ? (
          <p className="mt-10 text-center font-sans text-[14px] text-gray-400">
            No courses in this category yet. Check back soon.
          </p>
        ) : null}

        {hasMore ? (
          <motion.div
            {...fadeUp}
            className="mt-10 flex justify-center sm:mt-12 md:mt-14"
          >
            <motion.button
              type="button"
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              onClick={() => setPage((current) => current + 1)}
              className="inline-flex h-11 w-full max-w-[220px] items-center justify-center rounded-full bg-[#E6F8F5] px-8 font-sans text-[13px] font-semibold text-[#0DA694] transition-colors hover:bg-[#d5f3ee] disabled:opacity-60 sm:w-auto sm:text-[14px]"
            >
              {loading ? "Loading…" : "Load More"}
            </motion.button>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
