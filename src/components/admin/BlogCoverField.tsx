"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import axios from "axios";
import { ImagePlus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { BlogMedia } from "@/components/blog/BlogMedia";
import {
  THUMBNAIL_ACCEPT,
  thumbnailContentTypeFromFile,
  UploadAbortedError,
  uploadMediaFile,
} from "@/lib/upload-media";
import { cn } from "@/lib/utils";

export function BlogCoverField({
  value,
  disabled,
  compact,
  folder = "blog",
  onChange,
}: {
  value: string;
  disabled?: boolean;
  compact?: boolean;
  folder?: "blog" | "free-courses" | "site";
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [blobPreview, setBlobPreview] = useState<string | null>(null);

  function revokeBlobPreview() {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setBlobPreview(null);
  }

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, []);

  async function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const contentType = thumbnailContentTypeFromFile(file);
    if (!contentType) {
      toast.error("Use a JPEG, PNG, WebP, or GIF image.");
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    const blobUrl = URL.createObjectURL(file);
    blobUrlRef.current = blobUrl;
    setBlobPreview(blobUrl);
    setBusy(true);
    setProgress(0);

    try {
      const storageKey = await uploadMediaFile({
        file,
        folder,
        contentType,
        signal: controller.signal,
        onProgress: (loaded, total) =>
          setProgress(
            total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : 0,
          ),
      });
      onChange(storageKey);
    } catch (error) {
      revokeBlobPreview();
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
        revokeBlobPreview();
      }
    }
  }

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "relative overflow-hidden rounded-xl bg-zinc-100",
          compact ? "aspect-16/9" : "aspect-16/7",
        )}
      >
        {blobPreview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={blobPreview} alt="" className="h-full w-full object-cover" />
        ) : value.trim() ? (
          <BlogMedia stored={value} alt="" rounded="rounded-none" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            Cover image
          </div>
        )}
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={THUMBNAIL_ACCEPT}
            className="sr-only"
            disabled={disabled || busy}
            onChange={(event) => void onFileChange(event)}
          />
          <button
            type="button"
            disabled={disabled || busy}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-md bg-white/95 px-3 py-1.5 text-[12px] font-medium text-zinc-700 shadow-sm backdrop-blur hover:bg-white"
          >
            <ImagePlus className="size-3.5" />
            {busy ? `${progress ?? 0}%` : value.trim() ? "Replace" : "Upload"}
          </button>
          {value.trim() && !busy ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1.5 rounded-md bg-white/95 px-3 py-1.5 text-[12px] font-medium text-red-600 shadow-sm backdrop-blur hover:bg-white"
            >
              <Trash2 className="size-3.5" />
              Remove
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
