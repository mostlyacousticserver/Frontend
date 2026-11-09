"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  File,
  FileText,
} from "lucide-react";
import type { EnrolledLesson } from "@/types/learning";

type ClassroomLessonPanelProps = {
  lesson: EnrolledLesson;
  completed: boolean;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggleComplete: () => void;
  onDownloadResource: (resourceId: string) => void;
  onDownloadFile?: () => void;
};

export function ClassroomLessonPanel({
  lesson,
  completed,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onToggleComplete,
  onDownloadResource,
  onDownloadFile,
}: ClassroomLessonPanelProps) {
  const [tab, setTab] = useState<"description" | "resources">("description");

  const lessonResources = useMemo(() => {
    const items = [
      ...(lesson.contentType === "file" && lesson.hasFile && onDownloadFile
        ? [
            {
              id: `lesson-file-${lesson.id}`,
              title: lesson.title,
              fileType: lesson.fileType ?? "file",
              onDownload: onDownloadFile,
            },
          ]
        : []),
      ...lesson.resources.map((resource) => ({
        id: resource.id,
        title: resource.title,
        fileType: resource.fileType,
        onDownload: () => onDownloadResource(resource.id),
      })),
    ];
    return items;
  }, [lesson, onDownloadFile, onDownloadResource]);

  const hasResources = lessonResources.length > 0;

  useEffect(() => {
    setTab("description");
  }, [lesson.id]);

  useEffect(() => {
    if (!hasResources && tab === "resources") {
      setTab("description");
    }
  }, [hasResources, tab]);

  return (
    <div className="rounded-2xl border border-[#E8EEF2] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-sans text-[18px] font-bold text-[#111111] sm:text-[20px]">
            {lesson.title}
          </h1>
        </div>
        <button
          type="button"
          onClick={onToggleComplete}
          className={`inline-flex h-9 shrink-0 items-center rounded-lg px-3.5 font-sans text-[12px] font-semibold transition-colors sm:h-10 sm:text-[13px] ${
            completed
              ? "bg-[#E7F9F7] text-[#0DA694]"
              : "bg-[#11C5BB] text-white hover:bg-[#0fb0a7]"
          }`}
        >
          {completed ? "Completed" : "Mark complete"}
        </button>
      </div>

      <div className="mt-4 flex gap-5 border-b border-[#E8EEF2]">
        <TabButton
          active={tab === "description"}
          onClick={() => setTab("description")}
          label="Overview"
        />
        {hasResources ? (
          <TabButton
            active={tab === "resources"}
            onClick={() => setTab("resources")}
            label={`Resources (${lessonResources.length})`}
          />
        ) : null}
      </div>

      <div className="mt-4">
        {tab === "resources" && hasResources ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {lessonResources.map((item) => (
              <li key={item.id}>
                <ResourceCard
                  title={item.title}
                  fileType={item.fileType}
                  onDownload={item.onDownload}
                />
              </li>
            ))}
          </ul>
        ) : (
          <OverviewBody lesson={lesson} hasResources={hasResources} />
        )}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#E8EEF2] pt-4">
        <button
          type="button"
          disabled={!hasPrev}
          onClick={onPrev}
          className="inline-flex items-center gap-1 font-sans text-[13px] font-semibold text-[#374151] transition-colors hover:text-[#0DA694] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        <button
          type="button"
          disabled={!hasNext}
          onClick={onNext}
          className="inline-flex items-center gap-1 font-sans text-[13px] font-semibold text-[#374151] transition-colors hover:text-[#0DA694] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`-mb-px border-b-2 pb-2.5 font-sans text-[13px] font-semibold transition-colors ${
        active
          ? "border-[#11C5BB] text-[#0DA694]"
          : "border-transparent text-[#6B7280] hover:text-[#111111]"
      }`}
    >
      {label}
    </button>
  );
}

function OverviewBody({
  lesson,
  hasResources,
}: {
  lesson: EnrolledLesson;
  hasResources: boolean;
}) {
  if (lesson.contentType === "text") {
    return (
      <div className="space-y-2 font-sans text-[14px] leading-7 text-[#4B5563]">
        <p>
          Read this lesson in the content area above. Scroll to move through the
          article, or use fullscreen for a larger reading view.
        </p>
        {hasResources ? (
          <p>
            Downloadable files for this lesson are available in the Resources
            tab.
          </p>
        ) : null}
      </div>
    );
  }

  const notes = lesson.textContent?.trim() ?? "";
  if (notes) {
    return (
      <div className="whitespace-pre-wrap font-sans text-[14px] leading-7 text-[#4B5563]">
        {notes}
      </div>
    );
  }

  return (
    <div className="space-y-3 font-sans text-[14px] leading-7 text-[#4B5563]">
      <p>
        Watch this lesson carefully, then mark it complete when you are ready to
        move on. Use the curriculum on the left to jump between modules.
      </p>
      {hasResources ? (
        <p>
          Supporting files for this lesson are listed under the Resources tab.
        </p>
      ) : null}
    </div>
  );
}

function ResourceCard({
  title,
  fileType,
  onDownload,
}: {
  title: string;
  fileType: string;
  onDownload: () => void;
}) {
  const isPdf = fileType.toLowerCase().includes("pdf");
  const Icon = isPdf ? FileText : File;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#E8EEF2] bg-[#F8FAFB] px-3 py-3">
      <span
        className={`inline-flex size-10 shrink-0 items-center justify-center rounded-lg ${
          isPdf ? "bg-red-50 text-red-500" : "bg-[#E7F9F7] text-[#0DA694]"
        }`}
      >
        <Icon size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-sans text-[13px] font-semibold text-[#111111]">
          {title}
        </p>
        <p className="font-sans text-[11px] uppercase tracking-wide text-[#9CA3AF]">
          {fileType.replace(/^\./, "").toUpperCase() || "FILE"}
        </p>
      </div>
      <button
        type="button"
        onClick={onDownload}
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-[#6B7280] transition-colors hover:bg-white hover:text-[#0DA694]"
        aria-label={`Download ${title}`}
      >
        <Download size={16} />
      </button>
    </div>
  );
}
