"use client";

import { useResolvedMediaSrc } from "@/hooks/useResolvedMediaSrc";
import { BLOG_AVATAR_FALLBACK } from "@/lib/blog-content";
import { cn } from "@/lib/utils";

type AuthorAvatarProps = {
  name: string;
  stored: string | null | undefined;
  /** Sizing for the circle, e.g. `h-7 w-7`. */
  className?: string;
};

/**
 * Author photo, falling back to the house portrait when the author has none.
 *
 * The fallback sits underneath as the base layer and the author's own photo is
 * overlaid once it resolves. That covers every gap in one shape: an author with
 * no `avatarUrl` at all, a signed URL still in flight, and an image that 404s —
 * `useResolvedMediaSrc` clears `src` after its retry, which uncovers the
 * fallback again instead of leaving an empty circle.
 */
export function AuthorAvatar({ name, stored, className }: AuthorAvatarProps) {
  const { src, onError } = useResolvedMediaSrc(stored);

  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-hidden rounded-full bg-[#F3F4F6]",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BLOG_AVATAR_FALLBACK}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          onError={() => void onError()}
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
    </span>
  );
}
