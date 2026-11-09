"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Menu, X } from "lucide-react";

type ClassroomHeaderProps = {
  courseTitle: string;
  courseSlug: string;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
};

export function ClassroomHeader({
  courseTitle,
  courseSlug,
  sidebarOpen,
  onToggleSidebar,
}: ClassroomHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[#E8EEF2] bg-white px-4 sm:h-16 sm:px-6">
      <Link
        href="/learning"
        className="inline-flex min-w-0 items-center gap-2.5"
        aria-label="Mostly Acoustic home"
      >
        {/* Decorative: the wordmark beside it already names the site, and the
            link carries its own aria-label. */}
        <Image
          src="/images/Logo.png"
          alt=""
          width={80}
          height={80}
          loading="eager"
          className="size-9 shrink-0 object-contain sm:size-10"
        />
        <span className="truncate font-sans text-[15px] font-bold tracking-tight text-[#111111] sm:text-[16px]">
          Mostly Acoustic
        </span>
      </Link>

      <p className="mx-auto hidden min-w-0 max-w-md truncate text-center font-sans text-[13px] font-medium text-[#6B7280] lg:block">
        {courseTitle}
      </p>

      <div className="ml-auto flex items-center gap-2">
        <Link
          href={`/courses/${courseSlug}`}
          className="inline-flex items-center gap-1.5 font-sans text-[13px] font-semibold text-[#374151] transition-colors hover:text-[#0DA694]"
        >
          <ArrowLeft size={15} aria-hidden />
          <span className="hidden sm:inline">Back to Course</span>
          <span className="sm:hidden">Back</span>
        </Link>
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#374151] xl:hidden"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? "Close curriculum" : "Open curriculum"}
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
    </header>
  );
}
