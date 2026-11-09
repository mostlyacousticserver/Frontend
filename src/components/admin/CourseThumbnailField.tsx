"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import axios from "axios";
import { Upload } from "lucide-react";
import toast from "react-hot-toast";
import { MediaAPI } from "@/api/media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  compressThumbnail,
  THUMBNAIL_ACCEPT,
  thumbnailContentTypeFromFile,
  UploadAbortedError,
  uploadMediaFile,
} from "@/lib/upload-media";

function cloudFrontPreviewUrl(storageKey: string) {
  const domain = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN?.trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "");
  if (!domain || !storageKey.startsWith("public/")) return null;
  return `https://${domain}/${storageKey}`;
}

export function CourseThumbnailField({
  courseId,
  value,
  disabled,
  error,
  onChange,
}: {
  courseId?: string;
  value: string;
  disabled?: boolean;
  error?: string;
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
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const stored = value.trim();

    if (blobUrlRef.current && busy) {
      return;
    }

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

    const cdnUrl = cloudFrontPreviewUrl(stored);
    if (cdnUrl) {
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

    if (!thumbnailContentTypeFromFile(file)) {
      toast.error("Use a JPEG, PNG, WebP, or GIF image.");
      return;
    }

    // Resized before the presigned PUT: the bytes that land in the bucket are
    // the bytes the catalogue serves, so an untouched camera-sized export would
    // otherwise be what every visitor downloads.
    const { file: upload, contentType } = await compressThumbnail(file);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    const blobUrl = URL.createObjectURL(upload);
    blobUrlRef.current = blobUrl;
    setPreviewSrc(blobUrl);
    setBusy(true);
    setProgress(0);

    try {
      const storageKey = await uploadMediaFile({
        file: upload,
        folder: "thumbnails",
        contentType,
        courseId,
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
    <div className="space-y-2 md:col-span-2">
      <Label htmlFor="course-thumbnail">Thumbnail</Label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="relative h-28 w-full overflow-hidden rounded-lg border bg-muted sm:h-24 sm:w-40">
          {previewSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewSrc}
              alt="Course thumbnail preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-2 text-center text-xs text-muted-foreground">
              No image
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input
            ref={inputRef}
            id="course-thumbnail-file"
            type="file"
            accept={THUMBNAIL_ACCEPT}
            className="sr-only"
            disabled={disabled || busy}
            onChange={(event) => void onFileChange(event)}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={disabled || busy}
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              {busy ? `Uploading… ${progress ?? 0}%` : "Upload image"}
            </Button>
            {busy ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => abortRef.current?.abort()}
              >
                Cancel
              </Button>
            ) : null}
          </div>
          <Input
            id="course-thumbnail"
            placeholder="Or paste https:// URL"
            value={value}
            disabled={disabled || busy}
            onChange={(event) => onChange(event.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            JPEG, PNG, WebP, or GIF. Uploads are stored as a public catalog
            image; videos and lesson files stay private.
          </p>
        </div>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
