"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  Clock3,
  Link2,
  Share2,
} from "lucide-react";
import { BlogBlocks } from "@/components/blog/BlogBlocks";
import { AuthorAvatar } from "@/components/AuthorAvatar";
import { copyLink, shareOrCopyLink } from "@/lib/share";
import { BlogMedia } from "@/components/blog/BlogMedia";
import { ContentFaqSection } from "@/components/content/ContentFaqSection";
import { FreeCourseCard } from "@/components/free-courses/FreeCourseCard";
import {
  estimateReadTime,
  formatBlogDate,
  normalizeBlogContent,
  resolveAuthorName,
} from "@/lib/blog-content";
import type { FreeCourseDetail, FreeCourseListItem } from "@/types/free-course";

type FreeCourseArticleProps = {
  freeCourse: FreeCourseDetail;
  relatedCourses: FreeCourseListItem[];
};

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
};

export function FreeCourseArticle({
  freeCourse,
  relatedCourses,
}: FreeCourseArticleProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const content = normalizeBlogContent(freeCourse.content);
  const excerpt =
    freeCourse.metaDescription?.trim() || freeCourse.shortDescription;
  const published = formatBlogDate(freeCourse.publishedAt);

  const handleCopyLink = () => {
    void copyLink(window.location.href);
  };

  const shareCourse = () => {
    void shareOrCopyLink({
      title: freeCourse.title,
      text: excerpt,
      url: window.location.href,
    });
  };

  return (
    <div className="overflow-x-clip bg-white pb-12 pt-3 sm:pb-16 md:pb-20 lg:pb-24">
      <article>
        <header className="mx-auto max-w-4xl px-4 pt-8 sm:px-6 sm:pt-10 md:px-8 md:pt-12 lg:pt-16">
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Link
              href="/free-courses"
              className="inline-flex items-center gap-1.5 font-sans text-[12px] font-medium text-[#6B7280] transition-colors hover:text-[#0DA694] sm:gap-2 sm:text-[13px]"
            >
              <ArrowLeft size={14} className="sm:h-[15px] sm:w-[15px]" aria-hidden />
              Back to Free Courses
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="mt-6 sm:mt-7 md:mt-8"
          >
            <span className="inline-flex rounded-full bg-[#EFFCF9] px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-wide text-[#0DA694]">
              Free course
            </span>
            <h1 className="mt-4 font-sans text-[28px] font-bold leading-[1.2] tracking-[-0.025em] text-[#111111] sm:text-[36px] md:text-[42px] lg:text-[48px]">
              {freeCourse.title}
            </h1>
            {excerpt ? (
              <p className="mt-4 font-sans text-[15px] leading-7 text-[#6B7280] sm:mt-5 sm:text-[16px] sm:leading-8 md:text-[17px] md:leading-8">
                {excerpt}
              </p>
            ) : null}

            <div className="mt-6 flex flex-col gap-4 border-t border-[#E9EEF3] pt-5 font-sans text-[12px] text-[#6B7280] sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-3 sm:pt-6 sm:text-[13px]">
              <span className="inline-flex items-center gap-3">
                <AuthorAvatar
                  name={resolveAuthorName(freeCourse.author?.name)}
                  stored={freeCourse.author?.avatarUrl}
                  className="h-9 w-9 sm:h-10 sm:w-10"
                />
                <span className="font-semibold text-[#111111]">
                  {resolveAuthorName(freeCourse.author?.name)}
                </span>
              </span>
              {published ? (
                <>
                  <span className="hidden h-5 w-px bg-[#D1D5DB] sm:block" />
                  <time className="inline-flex items-center gap-2">
                    <CalendarDays size={14} className="sm:h-4 sm:w-4" aria-hidden />
                    {published}
                  </time>
                </>
              ) : null}
              <span className="hidden h-5 w-px bg-[#D1D5DB] sm:block" />
              <span className="inline-flex items-center gap-2">
                <Clock3 size={14} className="sm:h-4 sm:w-4" aria-hidden />
                {estimateReadTime(content)}
              </span>
            </div>
          </motion.div>
        </header>

        <div className="mx-auto mt-8 max-w-4xl px-4 sm:mt-10 sm:px-6 md:mt-12 md:px-8 lg:mt-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative aspect-[16/10] w-full overflow-hidden rounded-[16px] bg-[#F3F4F6] shadow-[0_12px_36px_rgba(15,23,42,0.1)] sm:aspect-[16/9] sm:rounded-[20px] md:rounded-[24px]"
          >
            <BlogMedia
              stored={freeCourse.coverImageUrl}
              alt={freeCourse.title}
              rounded="rounded-none"
              className="transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </motion.div>
        </div>

        <div className="mx-auto mt-8 max-w-4xl px-4 sm:mt-10 sm:px-6 md:mt-12 md:px-8 lg:mt-14">
          <BlogBlocks content={content} animated />

          {(freeCourse.faqs?.length ?? 0) > 0 ? (
            <motion.div {...fadeUp} className="mt-10 sm:mt-12 md:mt-14">
              <ContentFaqSection faqs={freeCourse.faqs ?? []} />
            </motion.div>
          ) : null}

          <motion.footer
            {...fadeUp}
            className="mt-12 flex flex-col gap-4 border-t border-[#E9EEF3] pt-6 sm:mt-14 sm:flex-row sm:items-center sm:justify-end sm:gap-5 sm:pt-7 md:mt-16"
          >
            <div
              className="flex items-center gap-3 self-start sm:self-auto"
              aria-label="Share course"
            >
              <ShareButton label="Share course" onClick={shareCourse}>
                <Share2 size={16} className="sm:h-4 sm:w-4" />
              </ShareButton>
              <ShareButton label="Copy course link" onClick={handleCopyLink}>
                <Link2 size={16} className="sm:h-4 sm:w-4" />
              </ShareButton>
              <ShareButton
                label="Bookmark course"
                onClick={() => setBookmarked((saved) => !saved)}
                pressed={bookmarked}
              >
                <Bookmark
                  size={16}
                  className={`sm:h-4 sm:w-4 ${bookmarked ? "fill-current" : ""}`}
                />
              </ShareButton>
            </div>
          </motion.footer>
        </div>
      </article>

      {relatedCourses.length > 0 ? (
        <section
          className="mx-auto mt-12 max-w-full border-t border-[#E9EEF3] px-4 pt-8 sm:mt-14 sm:px-6 sm:pt-10 md:mt-16 md:px-8 lg:mt-20 lg:px-10"
          aria-labelledby="related-free-courses"
        >
          <div className="mx-auto max-w-6xl">
            <motion.h2
              id="related-free-courses"
              {...fadeUp}
              className="font-sans text-[20px] font-bold text-[#111111] sm:text-[24px] md:text-[28px]"
            >
              More Free Courses
            </motion.h2>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:mt-7 sm:grid-cols-2 sm:gap-6 md:gap-7 lg:grid-cols-3">
              {relatedCourses.map((related) => (
                <FreeCourseCard key={related.id} freeCourse={related} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function ShareButton({
  label,
  onClick,
  pressed,
  children,
}: {
  label: string;
  onClick?: () => void;
  pressed?: boolean;
  children: ReactNode;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -1, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:border-[#11C5BB] hover:bg-[#EFFCF9] hover:text-[#0DA694] focus-visible:outline-2 focus-visible:outline-[#11C5BB] sm:h-10 sm:w-10 ${
        pressed
          ? "border-[#11C5BB] bg-[#EFFCF9] text-[#0DA694]"
          : "border-[#E5E7EB] text-[#6B7280]"
      }`}
    >
      {children}
    </motion.button>
  );
}
