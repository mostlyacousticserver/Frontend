"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import axios from "axios";
import { RotateCcw, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { MediaAPI } from "@/api/media";
import { Button } from "@/components/ui/button";
import {
  THUMBNAIL_ACCEPT,
  thumbnailContentTypeFromFile,
  UploadAbortedError,
  uploadMediaFile,
} from "@/lib/upload-media";
import { publicMediaUrl } from "@/lib/song-utils";
import { FALLBACK_HOME_HERO } from "@/types/site-settings";

export function HomeHeroImageField({
  storageKey,
  resolvedUrl,
  disabled,
  onUploaded,
  onReset,
}: {
  storageKey: string | null;
  resolvedUrl: string | null;
  disabled?: boolean;
  onUploaded: (storageKey: string) => Promise<void> | void;
  onReset: () => Promise<void> | void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string>(FALLBACK_HOME_HERO);
  const usingFallback = !storageKey?.trim();

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
    const stored = storageKey?.trim() ?? "";

    if (blobUrlRef.current && busy) return;

    if (!stored) {
      revokeBlobPreview();
      setPreviewSrc(FALLBACK_HOME_HERO);
      return;
    }

    if (resolvedUrl && /^https?:\/\//i.test(resolvedUrl)) {
      revokeBlobPreview();
      setPreviewSrc(resolvedUrl);
      return;
    }

    const cdnUrl = publicMediaUrl(stored);
    if (cdnUrl && /^https?:\/\//i.test(cdnUrl)) {
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
        if (!cancelled) setPreviewSrc(FALLBACK_HOME_HERO);
      });

    return () => {
      cancelled = true;
    };
  }, [busy, resolvedUrl, storageKey]);

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
      const key = await uploadMediaFile({
        file,
        folder: "site",
        contentType,
        signal: controller.signal,
        onProgress: (loaded, total) =>
          setProgress(
            total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : 0,
          ),
      });
      await onUploaded(key);
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
    <div className="space-y-3">
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border/80 bg-brand-navy">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewSrc}
          alt="Home hero preview"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />
        <p className="absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white">
          {usingFallback ? "Public fallback image" : "Custom hero image"}
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={THUMBNAIL_ACCEPT}
        className="sr-only"
        disabled={disabled || busy}
        onChange={(event) => void onFileChange(event)}
      />
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          disabled={disabled || busy}
          onClick={() => inputRef.current?.click()}
        >
          <Upload />
          {busy ? `Uploading… ${progress ?? 0}%` : "Upload hero image"}
        </Button>
        {busy ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => abortRef.current?.abort()}
          >
            Cancel
          </Button>
        ) : null}
        {!usingFallback ? (
          <Button
            type="button"
            variant="outline"
            disabled={disabled || busy}
            onClick={() => void onReset()}
          >
            <RotateCcw />
            Use public image
          </Button>
        ) : null}
      </div>
      <p className="text-sm text-muted-foreground">
        If no custom image is set, the homepage shows the public hero photo.
      </p>
    </div>
  );
}
