"use client";

import { use, useEffect, useState } from "react";
import { SongAPI } from "@/api/songs";
import { SongEditor } from "@/components/admin/SongEditor";
import { Skeleton } from "@/components/ui/skeleton";
import type { SongDetail } from "@/types/song";

export default function AdminEditSongPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [song, setSong] = useState<SongDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    SongAPI.getAdmin(id)
      .then((response) => {
        if (!cancelled) setSong(response.data);
      })
      .catch(() => {
        // interceptor
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (!song) {
    return <p className="text-sm text-muted-foreground">Song not found.</p>;
  }

  return <SongEditor song={song} />;
}
