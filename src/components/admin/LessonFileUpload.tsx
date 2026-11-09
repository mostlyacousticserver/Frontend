"use client";

import { useRef, useState, type ChangeEvent } from "react";
import axios from "axios";
import { Upload } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  RESOURCE_ACCEPT,
  resourceMetaFromFile,
  UploadAbortedError,
  uploadMediaFile,
} from "@/lib/upload-media";

export function LessonFileUpload({
  courseId,
  currentKey,
  currentType,
  disabled,
  onUploaded,
}: {
  courseId: string;
  currentKey: string;
  currentType?: string;
  disabled?: boolean;
  onUploaded: (storageKey: string, fileType: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{
    loaded: number;
    total: number;
    filename: string;
  } | null>(null);

  async function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const meta = resourceMetaFromFile(file);
    if (!meta) {
      toast.error(
        "Use a PDF, ZIP, Word, Excel, text, image, MP3, or WAV file.",
      );
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setBusy(true);
    setProgress({ loaded: 0, total: file.size, filename: file.name });

    try {
      const storageKey = await uploadMediaFile({
        file,
        folder: "resources",
        contentType: meta.contentType,
        courseId,
        signal: controller.signal,
        onProgress: (loaded, total) =>
          setProgress({ loaded, total, filename: file.name }),
      });
      onUploaded(storageKey, meta.fileType);
      toast.success("File uploaded");
    } catch (error) {
      if (error instanceof UploadAbortedError) {
        toast.success("Upload cancelled");
        return;
      }
      if (!axios.isAxiosError(error)) {
        toast.error(error instanceof Error ? error.message : "Upload failed");
      }
    } finally {
      if (abortRef.current === controller) {
        setBusy(false);
        setProgress(null);
        abortRef.current = null;
      }
    }
  }

  const percent =
    progress && progress.total > 0
      ? Math.min(100, Math.round((progress.loaded / progress.total) * 100))
      : 0;

  return (
    <div className="space-y-3 rounded-lg border p-3">
      <p className="text-sm font-medium">Lesson file</p>
      <p className="text-xs text-muted-foreground">
        Students will download this PDF, ZIP, or other file in the classroom
        player.
      </p>
      {currentKey ? (
        <p className="truncate text-xs text-muted-foreground">
          {currentType ? `${currentType.toUpperCase()} · ` : ""}
          {currentKey}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">No file uploaded yet.</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={RESOURCE_ACCEPT}
        className="sr-only"
        onChange={(event) => void onFileChange(event)}
      />
      {progress ? (
        <div className="space-y-1">
          <p className="truncate text-xs text-muted-foreground">
            {progress.filename}
          </p>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-brand-orange transition-[width]"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{percent}%</p>
        </div>
      ) : null}
      {busy ? (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => abortRef.current?.abort()}
        >
          Cancel upload
        </Button>
      ) : (
        <Button
          type="button"
          className="w-full"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          <Upload />
          {currentKey ? "Replace file" : "Upload file"}
        </Button>
      )}
    </div>
  );
}
