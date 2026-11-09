"use client";

import { useEffect, useState } from "react";
import { MediaAPI } from "@/api/media";
import { getAccessToken } from "@/lib/cookies";
import { publicMediaUrl } from "@/lib/song-utils";

function isDirectSrc(value: string) {
  return (
    /^https?:\/\//i.test(value) ||
    value.startsWith("/") ||
    value.startsWith("blob:")
  );
}

export function useResolvedMediaSrc(stored: string | null | undefined) {
  const [src, setSrc] = useState<string | null>(null);
  const [retried, setRetried] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const value = stored?.trim() ?? "";
    setRetried(false);

    if (!value) {
      setSrc(null);
      return;
    }

    if (isDirectSrc(value)) {
      setSrc(value);
      return;
    }

    const cdnUrl = publicMediaUrl(value);
    if (!getAccessToken()) {
      setSrc(cdnUrl.startsWith("http") ? cdnUrl : null);
      return;
    }

    MediaAPI.getUrl(value, { skipErrorToast: true })
      .then((response) => {
        if (!cancelled) setSrc(response.data.url);
      })
      .catch(() => {
        if (cancelled) return;
        setSrc(cdnUrl.startsWith("http") ? cdnUrl : null);
      });

    return () => {
      cancelled = true;
    };
  }, [stored]);

  async function onError() {
    const value = stored?.trim() ?? "";
    if (!value || retried || isDirectSrc(value)) {
      setSrc(null);
      return;
    }
    setRetried(true);
    try {
      const response = await MediaAPI.getUrl(value, { skipErrorToast: true });
      setSrc(response.data.url);
    } catch {
      setSrc(null);
    }
  }

  return { src, onError };
}
