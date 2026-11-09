"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BlogAPI } from "@/api/blogs";
import type { BlogListItem } from "@/types/blog";
import { BlogCard } from "./BlogCard";

// Matches the `xl` grid so every page of results fills whole rows.
const PAGE_SIZE = 8;
const ease = [0.22, 1, 0.36, 1] as const;

type BlogViewProps = {
  /** First page rendered on the server so posts are in the initial HTML. */
  initialBlogs?: BlogListItem[];
  initialTotal?: number;
};

export function BlogView({
  initialBlogs = [],
  initialTotal = 0,
}: BlogViewProps = {}) {
  const [blogs, setBlogs] = useState<BlogListItem[]>(initialBlogs);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(initialBlogs.length === 0);
  // True until the server-rendered first page has been consumed once.
  const serverRendered = useRef(initialBlogs.length > 0);
  const hasMore = blogs.length < total;

  useEffect(() => {
    // Page 1 already arrived with the HTML.
    if (serverRendered.current && page === 1) {
      serverRendered.current = false;
      return;
    }

    let cancelled = false;
    setLoading(true);
    BlogAPI.listPublished({ page, limit: PAGE_SIZE })
      .then((response) => {
        if (cancelled) return;
        setBlogs((current) =>
          page === 1
            ? response.data.items
            : [...current, ...response.data.items],
        );
        setTotal(response.data.total);
      })
      .catch(() => {
        // interceptor
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  return (
    <div className="overflow-x-clip bg-white pb-12 pt-3 sm:pb-16 md:pb-20 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <header className="pt-8 sm:pt-10 md:pt-12 lg:pt-14">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
            className="inline-flex items-center gap-1.5 font-sans text-[11px] font-medium tracking-[0.04em] text-[#6B7280] sm:gap-2 sm:text-[12px]"
          >
            <span
              className="h-1.5 w-1.5 rounded-full bg-[#11C5BB] sm:h-2 sm:w-2"
              aria-hidden
            />
            <span className="leading-snug">
              Beginner Friendly · Practical Tips · Real Progress
            </span>
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05, ease }}
            className="mt-3 max-w-2xl font-sans text-[26px] font-bold leading-[1.12] tracking-[-0.02em] text-[#111111] sm:mt-4 sm:text-[34px] md:text-[42px] lg:text-[46px]"
          >
            Learn, Practice &amp; Grow As A Guitarist
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease }}
            className="mt-3 max-w-xl font-sans text-[13px] leading-6 text-[#6B7280] sm:mt-4 sm:text-[14px] sm:leading-7 md:text-[15px]"
          >
            Guitar lessons, practice routines, learning tips, and musician
            insights to help you become a better guitarist — one lesson at a
            time.
          </motion.p>
        </header>

        <section className="mt-7 sm:mt-9 md:mt-12 lg:mt-14" aria-labelledby="all-blogs">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease }}
            className="flex flex-wrap items-center gap-2 sm:gap-3"
          >
            <h2
              id="all-blogs"
              className="font-sans text-[16px] font-bold text-[#111111] sm:text-[18px] md:text-[20px]"
            >
              Blogs
            </h2>
            <span className="rounded-full border border-[#E9EEF3] bg-[#F8FAFB] px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wide text-[#6B7280] sm:px-2.5 sm:py-1 sm:text-[11px]">
              {total} {total === 1 ? "Article" : "Articles"}
            </span>
          </motion.div>

          {loading && blogs.length === 0 ? (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-[4/5] animate-pulse rounded-[14px] bg-[#F3F4F6] sm:rounded-[18px]"
                />
              ))}
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence initial={false}>
                {blogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </AnimatePresence>
            </div>
          )}

          {!loading && blogs.length === 0 ? (
            <p className="mt-10 text-center font-sans text-[14px] text-gray-400">
              No published articles yet. Check back soon.
            </p>
          ) : null}

          {hasMore ? (
            <div className="mt-8 flex justify-center sm:mt-10">
              <motion.button
                type="button"
                whileHover={{ y: -1, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                onClick={() => setPage((current) => current + 1)}
                className="inline-flex h-11 w-full max-w-[220px] items-center justify-center rounded-full border border-[#11C5BB]/30 bg-[#EFFCF9] px-8 font-sans text-[13px] font-semibold text-[#0DA694] transition-colors hover:bg-[#11C5BB] hover:text-white disabled:opacity-60 sm:w-auto sm:text-[14px]"
              >
                {loading ? "Loading…" : "Load More"}
              </motion.button>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
