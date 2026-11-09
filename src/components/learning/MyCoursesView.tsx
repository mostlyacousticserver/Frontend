"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Award, BookOpen, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { LearningAPI } from "@/api/learning";
import { Skeleton } from "@/components/ui/skeleton";
import { getApiErrorMessage } from "@/lib/axios";
import { isRemoteImage } from "@/lib/image";
import { classroomPath } from "@/lib/learning";
import { courseThumbnailSrc } from "@/lib/public-course";
import type { MyCourseItem } from "@/types/learning";

export function MyCoursesView() {
  const [items, setItems] = useState<MyCourseItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    LearningAPI.listMyCourses()
      .then((response) => {
        if (!cancelled) setItems(response.data.items);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (items === null) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="aspect-[16/10] w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-[#E9EEF3] bg-white px-6 py-14 text-center shadow-[0_8px_28px_rgba(15,23,42,0.04)]">
        <BookOpen className="mx-auto size-10 text-[#11C5BB]" aria-hidden />
        <h2 className="mt-4 font-sans text-[20px] font-bold text-[#111111]">
          You have no courses yet
        </h2>
        <p className="mt-2 font-sans text-[14px] text-[#6B7280]">
          Browse the catalog and enroll to start learning.
        </p>
        <Link
          href="/courses"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#11C5BB] px-6 font-sans text-[14px] font-semibold text-white hover:bg-[#0fb0a7]"
        >
          Browse courses
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <MyCourseCard key={item.enrollmentId} item={item} />
      ))}
    </div>
  );
}

function MyCourseCard({ item }: { item: MyCourseItem }) {
  const thumbnail = courseThumbnailSrc(item.course);
  const continueHref = classroomPath(item.course.slug, item.continueLessonId);
  const started = item.completedLessons > 0 || (item.percentComplete ?? 0) > 0;
  const courseComplete = item.percentComplete === 100 && item.totalLessons > 0;
  const [downloadingCertificate, setDownloadingCertificate] = useState(false);

  async function downloadCertificate() {
    if (downloadingCertificate) return;
    setDownloadingCertificate(true);
    try {
      const response = await LearningAPI.getCertificate(item.course.id);
      window.open(response.data.downloadUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setDownloadingCertificate(false);
    }
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-[#E9EEF3] bg-white shadow-[0_8px_28px_rgba(15,23,42,0.05)]">
      <Link href={continueHref} className="relative block aspect-[16/9] bg-[#F3F4F6]">
        <Image
          src={thumbnail}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
          unoptimized={isRemoteImage(thumbnail)}
        />
      </Link>
      <div className="p-4 sm:p-5">
        <h2 className="font-sans text-[16px] font-bold leading-snug text-[#111111]">
          <Link href={continueHref} className="hover:text-[#0DA694]">
            {item.course.title}
          </Link>
        </h2>
        <p className="mt-1.5 font-sans text-[12px] text-[#6B7280]">
          {item.continueLessonTitle
            ? `Continue: ${item.continueLessonTitle}`
            : `${item.completedLessons} / ${item.totalLessons} lessons`}
        </p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E9EEF3]">
          <div
            className="h-full rounded-full bg-[#11C5BB]"
            style={{ width: `${Math.min(item.percentComplete, 100)}%` }}
          />
        </div>
        <p className="mt-1.5 font-sans text-[12px] font-medium text-[#4B5563]">
          {item.percentComplete}% complete
        </p>
        {item.orderId ? (
          <p className="mt-2 font-sans text-[11px] text-[#9CA3AF]">
            Purchase receipt was emailed to you.
          </p>
        ) : null}
        <div className="mt-4 flex flex-col gap-2">
          <Link
            href={continueHref}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#11C5BB] font-sans text-[13px] font-semibold text-white hover:bg-[#0fb0a7]"
          >
            {started ? "Continue learning" : "Start learning"}
          </Link>
          {courseComplete ? (
            <button
              type="button"
              disabled={downloadingCertificate}
              onClick={() => void downloadCertificate()}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[#E9EEF3] font-sans text-[13px] font-semibold text-[#111111] hover:border-[#11C5BB]/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {downloadingCertificate ? (
                <Loader2 size={14} className="animate-spin" aria-hidden />
              ) : (
                <Award size={14} aria-hidden />
              )}
              {downloadingCertificate
                ? "Preparing certificate…"
                : "Download certificate"}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
