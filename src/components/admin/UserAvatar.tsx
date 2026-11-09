"use client";

import Image from "next/image";
import { useState } from "react";
import { userInitials } from "@/lib/admin-format";

export function UserAvatar({
  name,
  src,
}: {
  name: string;
  src: string | null | undefined;
}) {
  // A Google avatar can 404 once the account drops it, and `alt=""` means a
  // failed load paints nothing at all — so remember which URL failed and fall
  // back to initials rather than leaving a hole in the row. Storing the URL
  // rather than a boolean lets a reused row retry for a different user.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const remote = src && /^https?:\/\//i.test(src) ? src : null;

  if (remote && remote !== failedSrc) {
    return (
      <Image
        src={remote}
        alt={`${name} avatar`}
        width={36}
        height={36}
        className="size-9 shrink-0 rounded-full object-cover"
        // Avatar CDNs (Google's included) rate-limit or reject hotlinks by
        // referrer; sending none keeps them serving the image.
        referrerPolicy="no-referrer"
        unoptimized
        onError={() => setFailedSrc(remote)}
      />
    );
  }

  return (
    <span
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-navy text-[11px] font-semibold text-white"
      title={name}
    >
      {userInitials(name)}
    </span>
  );
}
