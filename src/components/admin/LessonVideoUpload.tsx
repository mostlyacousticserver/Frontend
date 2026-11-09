"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import axios from "axios";
import { Play, RefreshCw, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { VideoAPI } from "@/api/video";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { formatDuration } from "@/lib/course-utils";
import {
  contentTypeFromFile,
  getLessonVideo,
  UploadAbortedError,
  uploadLessonVideo,
  type UploadPhase,
  type UploadProgress,
} from "@/lib/upload-lesson-video";
import type { LessonVideo, VideoProcessingStatus } from "@/types/video";

const ACCEPT = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-matroska",
  ".mp4",
  ".mov",
  ".webm",
  ".mkv",
].join(",");

const STATUS_LABEL: Record<VideoProcessingStatus, string> = {
  UPLOADING: "Uploading",
  UPLOADED: "Uploaded",
  PROCESSING: "Processing",
  READY: "Ready",
  FAILED: "Failed",
};

const PHASE_LABEL: Record<UploadPhase, string> = {
  preparing: "Preparing upload…",
  uploading: "Uploading to cloud…",
  completing: "Finalizing upload…",
  processing: "Processing video…",
};

export function LessonVideoUpload({
  lessonId,
  onDurationSeconds,
  onUploaded,
}: {
  lessonId: string;
  onDurationSeconds?: (seconds: number) => void;
  onUploaded?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const userCancelRef = useRef(false);
  const lessonIdRef = useRef(lessonId);
  lessonIdRef.current = lessonId;
  const onDurationSecondsRef = useRef(onDurationSeconds);
  onDurationSecondsRef.current = onDurationSeconds;
  const [video, setVideo] = useState<LessonVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);

  async function reload() {
    setLoading(true);
    try {
      setVideo(await getLessonVideo(lessonId));
    } catch {
      // API error toast handled by axios interceptor
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    setVideo(null);
    setProgress(null);
    setLoading(true);
    getLessonVideo(lessonId)
      .then((result) => {
        if (!cancelled) setVideo(result);
      })
      .catch(() => {
        // API error toast handled by axios interceptor
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
      abortRef.current?.abort();
    };
  }, [lessonId]);

  useEffect(() => {
    if (
      video?.processingStatus !== "PROCESSING" &&
      video?.processingStatus !== "UPLOADED"
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      VideoAPI.status(video.id)
        .then(async ({ data }) => {
          if (data.durationSeconds) {
            onDurationSecondsRef.current?.(data.durationSeconds);
          }
          if (data.status === "READY" || data.status === "FAILED") {
            const latest = await getLessonVideo(lessonIdRef.current);
            setVideo(latest);
            if (latest?.durationSeconds) {
              onDurationSecondsRef.current?.(latest.durationSeconds);
            }
            return;
          }
          if (data.status !== video.processingStatus) {
            setVideo((prev) =>
              prev
                ? {
                    ...prev,
                    processingStatus: data.status,
                    durationSeconds:
                      data.durationSeconds ?? prev.durationSeconds,
                    processingJobId: data.processingJobId,
                    processingError: data.error,
                    processingStartedAt: data.processingStartedAt,
                    processingCompletedAt: data.processingCompletedAt,
                  }
                : prev,
            );
          }
        })
        .catch(() => undefined);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [video?.id, video?.processingStatus]);

  const uploading = Boolean(progress) && busy;

  async function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const contentType = contentTypeFromFile(file);
    if (!contentType) {
      toast.error("Use an MP4, MOV, WebM, or MKV file.");
      return;
    }

    userCancelRef.current = false;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setBusy(true);
    setProgress({ loaded: 0, total: file.size, phase: "preparing" });

    try {
      const uploaded = await uploadLessonVideo({
        lessonId,
        file,
        contentType,
        signal: controller.signal,
        onProgress: setProgress,
      });
      setVideo(uploaded);
      if (uploaded.durationSeconds && uploaded.durationSeconds > 0) {
        onDurationSeconds?.(uploaded.durationSeconds);
      }
      onUploaded?.();

      if (uploaded.processingStatus === "READY") {
        toast.success("Video uploaded and ready");
      } else if (uploaded.processingStatus === "FAILED") {
        toast.error(uploaded.processingError || "Video processing failed");
      } else {
        toast.success("Video uploaded. Processing will continue in the background.");
      }
    } catch (error) {
      if (error instanceof UploadAbortedError) {
        if (userCancelRef.current) {
          toast.success("Upload cancelled");
        }
        if (lessonIdRef.current === lessonId) {
          await reload();
        }
        return;
      }
      if (!axios.isAxiosError(error)) {
        toast.error(error instanceof Error ? error.message : "Upload failed");
      }
      if (lessonIdRef.current === lessonId) {
        await reload();
      }
    } finally {
      if (abortRef.current === controller) {
        setBusy(false);
        setProgress(null);
        abortRef.current = null;
      }
    }
  }

  function cancelUpload() {
    userCancelRef.current = true;
    abortRef.current?.abort();
  }

  async function retryProcessing() {
    if (!video) return;
    setBusy(true);
    try {
      const { data } = await VideoAPI.retry(video.id);
      setVideo(data);
      toast.success("Processing restarted");
    } catch {
      // API error toast handled by axios interceptor
    } finally {
      setBusy(false);
    }
  }

  const percent =
    progress && progress.total > 0
      ? Math.min(100, Math.round((progress.loaded / progress.total) * 100))
      : 0;

  return (
    <div className="space-y-3">
      <Label>Video</Label>
      <div className="flex aspect-video items-center justify-center rounded-lg bg-brand-navy text-white">
        <Play className="size-10 fill-current" />
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Checking video…</p>
      ) : video ? (
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <p className="min-w-0 truncate text-sm font-medium">
              {video.originalFileName}
            </p>
            <StatusBadge status={video.processingStatus} />
          </div>
          <p className="text-xs text-muted-foreground">
            {formatBytes(video.originalFileSize)}
            {video.durationSeconds
              ? ` · ${formatDuration(video.durationSeconds)}`
              : ""}
          </p>
          {video.processingStatus === "FAILED" && video.processingError ? (
            <p className="text-xs text-destructive">{video.processingError}</p>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No video uploaded yet.
        </p>
      )}

      {progress ? (
        <div className="space-y-1">
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-brand-navy transition-[width]"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {PHASE_LABEL[progress.phase]} {percent}%
          </p>
        </div>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={onFileChange}
      />

      <div className="flex flex-col gap-2">
        {uploading ? (
          <Button type="button" variant="outline" onClick={cancelUpload}>
            Cancel upload
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={
              busy || video?.processingStatus === "PROCESSING"
            }
            onClick={() => inputRef.current?.click()}
          >
            <Upload />
            {video ? "Change Video" : "Upload Video"}
          </Button>
        )}
        {video?.processingStatus === "FAILED" && !uploading ? (
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => void retryProcessing()}
          >
            <RefreshCw />
            Retry processing
          </Button>
        ) : null}
        {video?.processingStatus === "UPLOADED" && !uploading ? (
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => void retryProcessing()}
          >
            <RefreshCw />
            Start processing
          </Button>
        ) : null}
        {video?.processingStatus === "PROCESSING" ? (
          <p className="text-xs text-muted-foreground">
            Wait for processing to finish before replacing this video.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: VideoProcessingStatus }) {
  const variant =
    status === "READY"
      ? "default"
      : status === "FAILED"
        ? "destructive"
        : "secondary";
  return (
    <Badge
      variant={variant}
      className={
        status === "READY"
          ? "bg-brand-navy text-white"
          : undefined
      }
    >
      {STATUS_LABEL[status]}
    </Badge>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} ${units[unit]}`;
}
