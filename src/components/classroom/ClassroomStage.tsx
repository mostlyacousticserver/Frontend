"use client";

import {
  Download,
  File,
  FileArchive,
  FileSpreadsheet,
  FileText,
  Loader2,
} from "lucide-react";
import { ProtectedLessonPlayer } from "@/components/classroom/ProtectedLessonPlayer";
import { TextLessonStage } from "@/components/classroom/TextLessonStage";
import type {
  EnrolledLesson,
  StudentVideoStatus,
} from "@/types/learning";

type ClassroomStageProps = {
  lesson: EnrolledLesson;
  mediaUrl: string | null;
  loading: boolean;
  error: string | null;
  startSeconds: number;
  onTimeUpdate: (seconds: number) => void;
  onEnded: () => void;
  onDownloadFile: () => void;
};

export function ClassroomStage({
  lesson,
  mediaUrl,
  loading,
  error,
  startSeconds,
  onTimeUpdate,
  onEnded,
  onDownloadFile,
}: ClassroomStageProps) {
  if (lesson.contentType === "text") {
    const article = lesson.textContent?.trim() ?? "";
    if (!article && lesson.resources.length > 0) {
      return (
        <TextLessonStage title={lesson.title} body="" />
      );
    }
    return (
      <TextLessonStage title={lesson.title} body={lesson.textContent ?? ""} />
    );
  }

  if (lesson.contentType === "file") {
    if (loading) {
      return <LoadingStage />;
    }
    if (lesson.hasFile && mediaUrl) {
      return (
        <FileDownloadStage
          files={[
            {
              id: "lesson-file",
              title: lesson.title,
              fileType: lesson.fileType ?? "file",
              onDownload: onDownloadFile,
              disabled: false,
            },
          ]}
        />
      );
    }
    if (error) {
      return <Placeholder title={error} />;
    }
    return (
      <Placeholder
        title="No file is attached to this lesson yet"
        detail="A downloadable file will appear here once it is added."
      />
    );
  }

  if (lesson.videoStatus === "FAILED") {
    return (
      <Placeholder
        title="This video failed to process"
        detail="Please try again later or contact support."
      />
    );
  }

  if (loading) {
    return <LoadingStage />;
  }

  if (error) {
    return <Placeholder title={error} />;
  }

  if (mediaUrl) {
    return (
      <div className="overflow-hidden rounded-2xl border border-[#E8EEF2] bg-black shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <ProtectedLessonPlayer
          url={mediaUrl}
          startSeconds={startSeconds}
          onTimeUpdate={onTimeUpdate}
          onEnded={onEnded}
        />
      </div>
    );
  }

  return (
    <Placeholder
      title={placeholderTitle(lesson.videoStatus)}
      detail="This lesson will play here once the video is ready."
    />
  );
}

function FileDownloadStage({
  files,
}: {
  files: Array<{
    id: string;
    title: string;
    fileType: string;
    onDownload: () => void;
    disabled: boolean;
  }>;
}) {
  return (
    <div className="flex aspect-video w-full items-center justify-center overflow-y-auto rounded-2xl border border-[#E8EEF2] bg-white px-4 py-8">
      <div className="w-full max-w-lg space-y-3">
        <p className="text-center font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-[#9CA3AF]">
          Downloadable content
        </p>
        {files.map((file) => {
          const Icon = iconForFileType(file.fileType);
          return (
            <div
              key={file.id}
              className="flex items-center gap-4 rounded-xl border border-[#E8EEF2] bg-[#F8FAFB] px-4 py-4"
            >
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#11C5BB]/15 text-[#11C5BB]">
                <Icon size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-sans text-[15px] font-semibold text-[#111111]">
                  {file.title}
                </p>
                <p className="mt-0.5 font-sans text-[12px] uppercase tracking-wide text-[#9CA3AF]">
                  {fileLabel(file.fileType)}
                </p>
              </div>
              <button
                type="button"
                disabled={file.disabled}
                onClick={file.onDownload}
                className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-[#11C5BB] px-3 font-sans text-[13px] font-semibold text-white hover:bg-[#0fb0a7] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download size={14} />
                Download
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LoadingStage() {
  return (
    <div className="flex aspect-video items-center justify-center rounded-2xl border border-[#E8EEF2] bg-[#111111]">
      <Loader2 className="size-8 animate-spin text-[#11C5BB]" aria-label="Loading" />
    </div>
  );
}

function placeholderTitle(status: StudentVideoStatus | null) {
  if (status === "PROCESSING") return "Video is processing";
  return "Nothing to play yet";
}

function Placeholder({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="flex aspect-video items-center justify-center rounded-2xl border border-[#E8EEF2] bg-[#111111] px-6 text-center">
      <div>
        <p className="font-sans text-[16px] font-semibold text-white">{title}</p>
        {detail ? (
          <p className="mt-2 font-sans text-[13px] text-white/60">{detail}</p>
        ) : null}
      </div>
    </div>
  );
}

function iconForFileType(fileType: string) {
  const type = fileType.toLowerCase();
  if (type.includes("zip") || type.includes("rar") || type.includes("7z")) {
    return FileArchive;
  }
  if (type.includes("xls") || type.includes("csv")) {
    return FileSpreadsheet;
  }
  if (type.includes("pdf") || type.includes("doc")) {
    return FileText;
  }
  return File;
}

function fileLabel(fileType: string) {
  const type = fileType.replace(/^\./, "").trim();
  return type ? `${type.toUpperCase()} file` : "File";
}
