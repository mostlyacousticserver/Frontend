"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpDown, ListTree, Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { CourseAPI } from "@/api/course";
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
import { formatCoursePrice } from "@/lib/course-utils";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CourseOrderDialog } from "@/components/admin/CourseOrderDialog";
import {
  AdminHero,
  AdminSearchField,
  AdminStatusBadge,
  AdminSurface,
} from "@/components/admin/admin-ui";
import type { AdminCourse } from "@/types/course";

export function CoursesList() {
  const router = useRouter();
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<AdminCourse | null>(null);
  const [removing, setRemoving] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
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

    CourseAPI.listAdmin({ page, limit, q: search || undefined })
      .then((response) => {
        if (cancelled) return;
        setCourses(response.data.items);
        setTotal(response.data.total);
      })
      .catch(() => {
        // API error toast handled by axios interceptor
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, search, reloadKey]);

  async function confirmDelete() {
    if (!deleting) return;
    setRemoving(true);
    try {
      await CourseAPI.remove(deleting.id);
      toast.success("Course deleted");
      setDeleting(null);
      const response = await CourseAPI.listAdmin({
        page,
        limit,
        q: search || undefined,
      });
      setCourses(response.data.items);
      setTotal(response.data.total);
    } catch {
      // API error toast handled by axios interceptor
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
          title="Courses"
          description="Create courses, then build modules, chapters, lessons, and resources."
          actions={
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOrdering(true)}
              >
                <ArrowUpDown />
                Reorder
              </Button>
              <Button asChild>
                <Link href="/admin/courses/new">
                  <Plus />
                  New course
                </Link>
              </Button>
            </div>
          }
        />
      </AdminHero>

      <AdminSurface>
        <div className="border-b border-border/80 p-4">
          <AdminSearchField
            value={query}
            onChange={setQuery}
            placeholder="Search courses"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="border-b text-left">
              <tr>
                <th className="w-12 px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="px-4 py-3" colSpan={6}>
                      <Skeleton className="h-5 w-full" />
                    </td>
                  </tr>
                ))
              ) : courses.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    No courses yet. Create one, then add curriculum.
                  </td>
                </tr>
              ) : (
                courses.map((course, index) => (
                  <tr
                    key={course.id}
                    className="border-b last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-mono text-muted-foreground">
                      {search ? "—" : (page - 1) * limit + index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{course.title}</div>
                      <div className="font-mono text-xs text-muted-foreground">
                        {course.slug}
                      </div>
                    </td>
                    <td className="px-4 py-3">{course.category.name}</td>
                    <td className="px-4 py-3">
                      {formatCoursePrice(course.price, course.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <AdminStatusBadge
                        published={course.isPublished}
                        extra={[
                          course.isFeatured ? "Featured" : null,
                          course.isComingSoon ? "Coming soon" : null,
                        ]
                          .filter(Boolean)
                          .join(" · ") || undefined}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Manage content for ${course.title}`}
                          onClick={() => router.push(`/admin/courses/${course.id}`)}
                        >
                          <ListTree />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Edit ${course.title}`}
                          onClick={() =>
                            router.push(`/admin/courses/${course.id}/edit`)
                          }
                        >
                          <Pencil />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Delete ${course.title}`}
                          onClick={() => setDeleting(course)}
                        >
                          <Trash2 />
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
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((current) => current - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {pageCount}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= pageCount}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </div>
      ) : null}

      <CourseOrderDialog
        open={ordering}
        onOpenChange={setOrdering}
        onSaved={() => setReloadKey((key) => key + 1)}
      />

      <AlertDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open && !removing) setDeleting(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this course?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting
                ? `“${deleting.title}” will be unpublished and removed from the catalog.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={removing}
              onClick={(event) => {
                event.preventDefault();
                void confirmDelete();
              }}
            >
              {removing ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
