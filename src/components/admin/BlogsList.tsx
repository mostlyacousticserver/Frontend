"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { BlogAPI } from "@/api/blogs";
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
import type { BlogListItem } from "@/types/blog";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  AdminHero,
  AdminSearchField,
  AdminStatusBadge,
  AdminSurface,
} from "@/components/admin/admin-ui";
import { formatBlogDate } from "@/lib/blog-content";
import { BlogMedia } from "@/components/blog/BlogMedia";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "published" | "draft";

export function BlogsList() {
  const [blogs, setBlogs] = useState<BlogListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<BlogListItem | null>(null);
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
    BlogAPI.listAdmin({
      page,
      limit,
      q: search || undefined,
      isPublished:
        status === "all" ? undefined : status === "published",
    })
      .then((response) => {
        if (cancelled) return;
        setBlogs(response.data.items);
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
  }, [page, search, status]);

  async function confirmDelete() {
    if (!deleting) return;
    setRemoving(true);
    try {
      await BlogAPI.remove(deleting.id);
      toast.success("Blog deleted");
      setDeleting(null);
      const response = await BlogAPI.listAdmin({
        page,
        limit,
        q: search || undefined,
        isPublished:
          status === "all" ? undefined : status === "published",
      });
      setBlogs(response.data.items);
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
          eyebrow="Content"
          title="Blogs"
          description="Write and publish posts that appear on the public marketing site."
          actions={
            <Button asChild>
              <Link href="/admin/blogs/new">
                <Plus />
                New blog
              </Link>
            </Button>
          }
        />
      </AdminHero>

      <AdminSurface>
        <div className="flex flex-col gap-3 border-b border-border/80 p-4 sm:flex-row sm:items-center sm:justify-between">
          <AdminSearchField
            value={query}
            onChange={setQuery}
            placeholder="Search blogs"
          />
          <div className="flex rounded-lg bg-zinc-100 p-0.5">
            {(
              [
                ["all", "All"],
                ["published", "Published"],
                ["draft", "Drafts"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setStatus(value);
                  setPage(1);
                }}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[13px] font-medium",
                  status === value
                    ? "bg-white text-brand-navy shadow-sm"
                    : "text-zinc-500 hover:text-brand-navy",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Post</th>
                <th className="px-4 py-3 font-medium">Author</th>
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="px-4 py-3" colSpan={5}>
                      <Skeleton className="h-5 w-full" />
                    </td>
                  </tr>
                ))
              ) : blogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    No blogs yet. Write a post to get started.
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                          <BlogMedia
                            stored={blog.coverImageUrl}
                            alt=""
                            rounded="rounded-lg"
                          />
                        </div>
                        <span className="font-medium">{blog.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {blog.author?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatBlogDate(blog.publishedAt) || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <AdminStatusBadge published={blog.isPublished} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button asChild size="icon-sm" variant="ghost">
                          <Link href={`/admin/blogs/${blog.id}`}>
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => setDeleting(blog)}
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
            <AlertDialogTitle>Delete blog?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting
                ? `Delete “${deleting.title}”? This cannot be undone.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={removing}
              onClick={() => void confirmDelete()}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
