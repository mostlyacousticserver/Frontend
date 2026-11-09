"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import axios from "axios";
import { ImagePlus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { MediaAPI } from "@/api/media";
import {
  THUMBNAIL_ACCEPT,
  thumbnailContentTypeFromFile,
  UploadAbortedError,
  uploadMediaFile,
} from "@/lib/upload-media";
import { publicMediaUrl } from "@/lib/song-utils";

export function SongHeroField({
  songId,
  value,
  disabled,
  onChange,
}: {
  songId?: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  function revokeBlobPreview() {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  }

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const stored = value.trim();
    if (blobUrlRef.current && busy) return;

    if (!stored) {
      revokeBlobPreview();
      setPreviewSrc(null);
      return;
    }

    if (/^https?:\/\//i.test(stored)) {
      revokeBlobPreview();
      setPreviewSrc(stored);
      return;
    }

    const cdnUrl = publicMediaUrl(stored);
    if (cdnUrl.startsWith("http")) {
      revokeBlobPreview();
      setPreviewSrc(cdnUrl);
      return;
    }

    MediaAPI.getUrl(stored)
      .then((response) => {
        if (!cancelled) {
          revokeBlobPreview();
          setPreviewSrc(response.data.url);
        }
      })
      .catch(() => {
        if (!cancelled) setPreviewSrc(null);
      });

    return () => {
      cancelled = true;
    };
  }, [busy, value]);

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
    setPreviewSrc(blobUrl);
    setBusy(true);
    setProgress(0);

    try {
      const storageKey = await uploadMediaFile({
        file,
        folder: "songs",
        contentType,
        songId,
        signal: controller.signal,
        onProgress: (loaded, total) =>
          setProgress(
            total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : 0,
          ),
      });
      onChange(storageKey);
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

  return (
    <div className="space-y-2">
      <div className="relative aspect-16/7 overflow-hidden rounded-xl bg-zinc-100">
        {previewSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewSrc} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            Hero image
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
            {busy ? `${progress ?? 0}%` : previewSrc ? "Replace" : "Upload"}
          </button>
          {previewSrc && !busy ? (
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
