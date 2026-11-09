"use client";

import { motion } from "framer-motion";
import { Check, FileText, Play, Type } from "lucide-react";
import type {
  CourseLesson,
  CourseModule,
  CourseOutlineChapter,
} from "@/data/course";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { courseEase, courseFadeUp } from "./motion";

type CourseContentProps = {
  learningPoints: string[];
  modules: CourseModule[];
  outline?: CourseOutlineChapter[];
  requirements: string[];
  audience: string[];
};

export function CourseContent({
  learningPoints,
  modules,
  outline,
  requirements,
  audience,
}: CourseContentProps) {
  const chapters = outline?.length ? outline : null;
  const totalLessons = chapters
    ? chapters.reduce((sum, chapter) => sum + chapter.lessonCount, 0)
    : modules.reduce((sum, module) => sum + module.lessonCount, 0);

  return (
    <>
      {learningPoints.length > 0 ? (
        <motion.section
          {...courseFadeUp}
          className="rounded-[16px] border border-[#E9EEF3] bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,0.04)] sm:rounded-[20px] sm:p-5 md:p-6 lg:p-7"
        >
          <h2 className="font-sans text-[18px] font-bold text-[#111111] sm:text-[20px] md:text-[22px]">
            What You&apos;ll Learn
          </h2>
          <ul className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-4">
            {learningPoints.map((point, index) => (
              <motion.li
                key={point}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.05,
                  ease: courseEase,
                }}
                className="flex items-start gap-2.5 sm:gap-3"
              >
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E6F8F5] text-[#0DA694] sm:h-6 sm:w-6">
                  <Check size={12} className="sm:h-3.5 sm:w-3.5" strokeWidth={2.5} aria-hidden />
                </span>
                <span className="font-sans text-[13px] leading-5 text-[#4B5563] sm:text-[14px] sm:leading-6">
                  {point}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.section>
      ) : null}

      {(chapters && chapters.length > 0) || modules.length > 0 ? (
        <motion.section
          {...courseFadeUp}
          className="rounded-[16px] border border-[#E9EEF3] bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,0.04)] sm:rounded-[20px] sm:p-5 md:p-6 lg:p-7"
        >
          <div className="flex flex-wrap items-end justify-between gap-2 sm:gap-3">
            <h2 className="font-sans text-[18px] font-bold text-[#111111] sm:text-[20px] md:text-[22px]">
              Course Content
            </h2>
            <p className="font-sans text-[12px] text-[#9CA3AF] sm:text-[13px]">
              {chapters ? chapters.length : modules.length}{" "}
              {chapters ? "chapters" : "modules"} · {totalLessons} lessons
            </p>
          </div>

          <Accordion type="multiple" className="mt-3 w-full sm:mt-4">
            {chapters
              ? chapters.map((chapter) => (
                  <AccordionItem key={chapter.id} value={chapter.id}>
                    <AccordionTrigger className="items-start gap-2 py-3 sm:items-center sm:py-4">
                      <span className="flex min-w-0 flex-1 flex-col gap-1 pr-1 text-left sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pr-2">
                        <span className="font-sans text-[13px] font-semibold leading-snug text-[#111111] sm:text-[14px] md:text-[15px]">
                          {chapter.title}
                        </span>
                        <span className="shrink-0 font-sans text-[11px] font-medium text-[#9CA3AF] sm:text-[12px] md:text-[13px]">
                          {chapter.lessonCount} lessons
                          {chapter.duration ? ` · ${chapter.duration}` : ""}
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 rounded-xl bg-[#F8FAFB] p-1.5 sm:space-y-4 sm:p-2">
                        {chapter.modules.map((module) => (
                          <div key={module.id}>
                            <p className="px-2.5 pb-1 font-sans text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF] sm:px-3 sm:text-[12px]">
                              {module.title}
                            </p>
                            <LessonList lessons={module.lessons} />
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))
              : modules.map((module) => (
                  <AccordionItem key={module.id} value={module.id}>
                    <AccordionTrigger className="items-start gap-2 py-3 sm:items-center sm:py-4">
                      <span className="flex min-w-0 flex-1 flex-col gap-1 pr-1 text-left sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pr-2">
                        <span className="font-sans text-[13px] font-semibold leading-snug text-[#111111] sm:text-[14px] md:text-[15px]">
                          {module.title}
                        </span>
                        <span className="shrink-0 font-sans text-[11px] font-medium text-[#9CA3AF] sm:text-[12px] md:text-[13px]">
                          {module.lessonCount} lessons
                          {module.duration ? ` · ${module.duration}` : ""}
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="rounded-xl bg-[#F8FAFB] p-1.5 sm:p-2">
                        <LessonList lessons={module.lessons} />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
          </Accordion>
        </motion.section>
      ) : null}

      <ListSection title="Requirements" items={requirements} />
      <ListSection title="Who This Course Is For" items={audience} />
    </>
  );
}

function LessonList({ lessons }: { lessons: CourseLesson[] }) {
  return (
    <ul className="space-y-0.5 sm:space-y-1">
      {lessons.map((lesson) => {
        const Icon = lessonIcon(lesson.contentType);
        return (
          <li
            key={lesson.id}
            className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 transition-colors hover:bg-white sm:gap-3 sm:px-3 sm:py-2.5"
          >
            <span className="inline-flex min-w-0 items-center gap-2 sm:gap-2.5">
              <Icon
                size={13}
                className="shrink-0 text-[#11C5BB]"
                aria-hidden
              />
              <span className="truncate font-sans text-[12px] text-[#4B5563] sm:text-[13px] md:text-[14px]">
                {lesson.title}
              </span>
              {lesson.isPreview ? (
                <span className="shrink-0 rounded-full bg-[#E6F8F5] px-1.5 py-0.5 font-sans text-[10px] font-semibold text-[#0DA694]">
                  Preview
                </span>
              ) : null}
            </span>
            {lesson.duration ? (
              <span className="shrink-0 font-sans text-[11px] text-[#9CA3AF] sm:text-[12px]">
                {lesson.duration}
              </span>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function lessonIcon(contentType: CourseLesson["contentType"]) {
  if (contentType === "file") return FileText;
  if (contentType === "text") return Type;
  return Play;
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;

  return (
    <motion.section
      {...courseFadeUp}
      className="rounded-[16px] border border-[#E9EEF3] bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,0.04)] sm:rounded-[20px] sm:p-5 md:p-6 lg:p-7"
    >
      <h2 className="font-sans text-[18px] font-bold text-[#111111] sm:text-[20px] md:text-[22px]">
        {title}
      </h2>
      <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 font-sans text-[13px] leading-5 text-[#4B5563] sm:text-[14px] sm:leading-6"
          >
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#11C5BB] sm:mt-2"
              aria-hidden
            />
            {item}
          </li>
        ))}
      </ul>
    </motion.section>
  );
}
