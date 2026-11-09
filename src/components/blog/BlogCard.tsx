"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AuthorAvatar } from "@/components/AuthorAvatar";
import { BlogMedia } from "@/components/blog/BlogMedia";
import { formatBlogDate, resolveAuthorName } from "@/lib/blog-content";
import type { BlogListItem } from "@/types/blog";

type BlogCardProps = {
  blog: BlogListItem;
};

export function BlogCard({ blog }: BlogCardProps) {
  const date = formatBlogDate(blog.publishedAt);
  const authorName = resolveAuthorName(blog.author?.name);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[14px] border border-[#E9EEF3] bg-white shadow-[0_6px_20px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_14px_32px_rgba(15,23,42,0.09)] sm:rounded-[18px] sm:shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
    >
      <Link
        href={`/blog/${blog.slug}`}
        className="flex flex-1 flex-col"
        aria-label={`Read blog post: ${blog.title}`}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F3F4F6]">
          <BlogMedia
            stored={blog.coverImageUrl}
            alt={blog.title}
            rounded="rounded-none"
            className="transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>

        <div className="flex flex-1 flex-col p-3.5 sm:p-4 md:p-5">
          {date ? (
            <time className="font-sans text-[11px] text-[#9CA3AF] sm:text-[12px]">
              {date}
            </time>
          ) : null}

          <h3 className="mt-2.5 line-clamp-2 font-sans text-[14px] font-bold leading-5 text-[#111111] transition-colors group-hover:text-[#0DA694] sm:mt-3 sm:text-[15px] sm:leading-6 md:text-[16px]">
            {blog.title}
          </h3>

          {blog.metaDescription ? (
            <p className="mt-2 line-clamp-2 font-sans text-[12px] leading-5 text-[#6B7280] sm:text-[13px]">
              {blog.metaDescription}
            </p>
          ) : null}

          <div className="mt-auto flex items-center pt-3 sm:pt-4">
            <span className="inline-flex min-w-0 items-center gap-1.5 sm:gap-2">
              <AuthorAvatar
                name={authorName}
                stored={blog.author?.avatarUrl}
                className="h-6 w-6 sm:h-7 sm:w-7"
              />
              <span className="truncate font-sans text-[12px] font-medium text-[#6B7280] sm:text-[13px]">
                {authorName}
              </span>
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
