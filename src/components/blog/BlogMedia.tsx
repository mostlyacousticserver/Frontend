"use client";

import { useResolvedMediaSrc } from "@/hooks/useResolvedMediaSrc";
import { cn } from "@/lib/utils";

export function BlogMedia({
  stored,
  alt,
  className,
  rounded = "rounded-xl",
}: {
  stored: string | null | undefined;
  alt: string;
  className?: string;
  rounded?: string;
}) {
  const { src, onError } = useResolvedMediaSrc(stored);
  const value = stored?.trim() ?? "";

  if (!value) return null;

  if (!src) {
    return (
      <div
        className={cn("h-full w-full animate-pulse bg-zinc-100", rounded, className)}
        aria-hidden
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => void onError()}
      className={cn("h-full w-full object-cover", rounded, className)}
    />
  );
}
