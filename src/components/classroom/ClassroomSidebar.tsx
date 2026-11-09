"use client";

import Link from "next/link";
import {
  Check,
  ChevronDown,
  Circle,
  FileText,
  Play,
  Type,
} from "lucide-react";
import { ClassroomProgressCard } from "@/components/classroom/ClassroomProgressCard";
import { formatDuration } from "@/lib/course-utils";
import { classroomPath } from "@/lib/learning";
import type { EnrolledLesson, EnrolledModule } from "@/types/learning";

type ClassroomSidebarProps = {
  slug: string;
  modules: EnrolledModule[];
  currentLessonId: string;
  completedIds: Set<string>;
  openModuleIds: string[];
  percent: number;
  completedCount: number;
  remainingCount: number;
  estimatedDays: number | null;
  onToggleModule: (moduleId: string) => void;
  onNavigate?: () => void;
};

export function ClassroomSidebar({
  slug,
  modules,
  currentLessonId,
  completedIds,
  openModuleIds,
  percent,
  completedCount,
  remainingCount,
  estimatedDays,
  onToggleModule,
  onNavigate,
}: ClassroomSidebarProps) {
  let lessonNumber = 0;

  return (
    <div className="flex h-full flex-col bg-transparent">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#E8EEF2] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        <div className="shrink-0 border-b border-[#E8EEF2] px-4 py-3.5">
          <h2 className="font-sans text-[14px] font-bold text-[#111111]">
            Course Curriculum
          </h2>
        </div>

        <nav
          className="min-h-0 flex-1 overflow-y-auto"
          aria-label="Course curriculum"
        >
          <ul>
            {modules.map((module, moduleIndex) => {
              const open = openModuleIds.includes(module.id);
              return (
                <li key={module.id} className="border-b border-[#F1F5F9]">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left hover:bg-[#F8FAFB]"
                    onClick={() => onToggleModule(module.id)}
                    aria-expanded={open}
                  >
                    <span className="font-sans text-[13px] font-semibold text-[#111111]">
                      Module {moduleIndex + 1}: {module.title}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`shrink-0 text-[#9CA3AF] transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {open
                    ? module.chapters.map((chapter) => (
                        <div key={chapter.id}>
                          {module.chapters.length > 1 ? (
                            <p className="px-4 pb-1 font-sans text-[11px] font-medium text-[#9CA3AF]">
                              {chapter.title}
                            </p>
                          ) : null}
                          <ul className="pb-2">
                            {chapter.lessons.map((lesson) => {
                              lessonNumber += 1;
                              const number = lessonNumber;
                              const active = lesson.id === currentLessonId;
                              const done = completedIds.has(lesson.id);
                              return (
                                <li key={lesson.id}>
                                  <Link
                                    href={classroomPath(slug, lesson.id)}
                                    onClick={onNavigate}
                                    className={`mx-2 flex items-start gap-2.5 rounded-xl px-2.5 py-2.5 transition-colors ${
                                      active
                                        ? "bg-[#E7F9F7] text-[#0DA694]"
                                        : "text-[#374151] hover:bg-[#F8FAFB]"
                                    }`}
                                  >
                                    <LessonStatusIcon
                                      active={active}
                                      done={done}
                                      contentType={lesson.contentType}
                                    />
                                    <span className="min-w-0 flex-1">
                                      <span
                                        className={`block font-sans text-[13px] leading-5 ${
                                          active
                                            ? "font-semibold text-[#0DA694]"
                                            : done
                                              ? "font-medium text-[#111111]"
                                              : "font-medium text-[#374151]"
                                        }`}
                                      >
                                        {number}. {lesson.title}
                                      </span>
                                      <span
                                        className={`mt-0.5 block font-sans text-[11px] ${
                                          active
                                            ? "text-[#0DA694]/80"
                                            : "text-[#9CA3AF]"
                                        }`}
                                      >
                                        {formatDuration(
                                          lesson.videoDurationSeconds,
                                        ) ??
                                          (lesson.contentType === "video"
                                            ? "Video"
                                            : lesson.contentType === "file"
                                              ? "File"
                                              : "Article")}
                                        {lesson.videoStatus === "PROCESSING"
                                          ? " · Processing"
                                          : ""}
                                      </span>
                                    </span>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))
                    : null}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="mt-4 shrink-0 xl:hidden">
        <ClassroomProgressCard
          compact
          percent={percent}
          completed={completedCount}
          remaining={remainingCount}
          estimatedDays={estimatedDays}
        />
      </div>
    </div>
  );
}

function LessonStatusIcon({
  active,
  done,
  contentType,
}: {
  active: boolean;
  done: boolean;
  contentType: EnrolledLesson["contentType"];
}) {
  if (done && !active) {
    return (
      <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[#11C5BB] text-white">
        <Check size={11} strokeWidth={3} />
      </span>
    );
  }

  if (active) {
    return (
      <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[#11C5BB] text-white">
        {contentType === "file" ? (
          <FileText size={11} />
        ) : contentType === "text" ? (
          <Type size={11} />
        ) : (
          <Play size={10} fill="currentColor" className="ml-px" />
        )}
      </span>
    );
  }

  return (
    <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center text-[#D1D5DB]">
      <Circle size={18} strokeWidth={1.75} />
    </span>
  );
}
