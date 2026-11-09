"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { SongAPI } from "@/api/songs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { SongListItem } from "@/types/song";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  AdminHero,
  AdminSearchField,
  AdminStatusBadge,
  AdminSurface,
} from "@/components/admin/admin-ui";

export function SongsList() {
  const [songs, setSongs] = useState<SongListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<SongListItem | null>(null);
  const [removing, setRemoving] = useState(false);
  const limit = 20;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPage(1);
      setSearch(query.trim());
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    SongAPI.listAdmin({ page, limit, q: search || undefined })
      .then((response) => {
        if (cancelled) return;
        setSongs(response.data.items);
        setTotal(response.data.total);
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
  }, [page, search]);

  async function confirmDelete() {
    if (!deleting) return;
    setRemoving(true);
    try {
      await SongAPI.remove(deleting.id);
      toast.success("Song deleted");
      setDeleting(null);
      const response = await SongAPI.listAdmin({
        page,
        limit,
        q: search || undefined,
      });
      setSongs(response.data.items);
      setTotal(response.data.total);
    } catch {
      // interceptor
    } finally {
      setRemoving(false);
    }
  }

  const pageCount = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-6">
      <AdminHero>
        <AdminPageHeader
          variant="onDark"
          eyebrow="Catalog"
          title="Songs"
          description="Write chord sheets with lyrics, tabs, and diagrams, then publish them to the public catalog."
          actions={
            <Button asChild>
              <Link href="/admin/songs/new">
                <Plus />
                New song
              </Link>
            </Button>
          }
        />
      </AdminHero>

      <AdminSurface>
        <div className="border-b border-border/80 p-4">
          <AdminSearchField
            value={query}
            onChange={setQuery}
            placeholder="Search songs"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-border/70 text-left">
              <tr className="text-xs font-semibold tracking-wider uppercase text-brand-navy/70">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Artist</th>
                <th className="px-4 py-3">Genre</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index} className="border-b border-border/60 transition-colors last:border-0">
                    <td className="px-4 py-3" colSpan={5}>
                      <Skeleton className="h-5 w-full" />
                    </td>
                  </tr>
                ))
              ) : songs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    No songs yet. Create a chord sheet to get started.
                  </td>
                </tr>
              ) : (
                songs.map((song) => (
                  <tr key={song.id} className="border-b border-border/60 transition-colors last:border-0">
                    <td className="px-4 py-3 font-medium">{song.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {song.artist}
                    </td>
                    <td className="px-4 py-3">{song.genre ?? "—"}</td>
                    <td className="px-4 py-3">
                      <AdminStatusBadge published={song.isPublished} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button asChild size="icon-sm" variant="ghost">
                          <Link href={`/admin/songs/${song.id}`}>
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => setDeleting(song)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminSurface>

      {pageCount > 1 ? (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pageCount}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      ) : null}

      <AlertDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete song?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting
                ? `Delete “${deleting.title}”? This cannot be undone.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={removing} onClick={() => void confirmDelete()}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
