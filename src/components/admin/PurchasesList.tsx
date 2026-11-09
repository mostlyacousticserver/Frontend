"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AdminAPI } from "@/api/admin";
import { CourseAPI } from "@/api/course";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  AdminHero,
  AdminSearchField,
  AdminSurface,
} from "@/components/admin/admin-ui";
import { UserAvatar } from "@/components/admin/UserAvatar";
import { formatAdminDate, formatAdminMoney } from "@/lib/admin-format";
import type { AdminCourse } from "@/types/course";
import type { AdminEnrollment } from "@/types/admin";

export function PurchasesList() {
  const searchParams = useSearchParams();
  const userIdFromUrl = searchParams.get("userId") ?? "";
  const courseIdFromUrl = searchParams.get("courseId") ?? "";
  const [items, setItems] = useState<AdminEnrollment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [courseId, setCourseId] = useState(courseIdFromUrl);
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const limit = 20;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPage(1);
      setSearch(query.trim());
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    CourseAPI.listAdmin({ page: 1, limit: 100 })
      .then((response) => setCourses(response.data.items))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    AdminAPI.listEnrollments({
      page,
      limit,
      q: search || undefined,
      courseId: courseId || undefined,
      userId: userIdFromUrl || undefined,
    })
      .then((response) => {
        if (cancelled) return;
        setItems(response.data.items);
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
  }, [page, search, courseId, userIdFromUrl]);

  useEffect(() => {
    setPage(1);
    setCourseId(courseIdFromUrl);
  }, [userIdFromUrl, courseIdFromUrl]);

  const pageCount = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-6">
      <AdminHero>
        <AdminPageHeader
          variant="onDark"
          eyebrow="People"
          title="Purchases"
          description="See who bought which course, when they enrolled, and the order it came from."
        />
      </AdminHero>

      <AdminSurface>
        <div className="flex flex-col gap-3 border-b border-border/80 p-4 sm:flex-row sm:items-center sm:justify-between">
          <AdminSearchField
            value={query}
            onChange={setQuery}
            placeholder="Search student or course"
          />
          <select
            value={courseId}
            onChange={(event) => {
              setCourseId(event.target.value);
              setPage(1);
            }}
            className="h-9 rounded-md border border-border/80 bg-white px-2.5 text-sm"
          >
            <option value="">All courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
        {userIdFromUrl ? (
          <div className="border-b border-border/80 px-4 py-2 text-sm text-muted-foreground">
            Showing purchases for one student.{" "}
            <Link href="/admin/purchases" className="font-medium text-brand-navy underline">
              Clear filter
            </Link>
          </div>
        ) : null}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-sm">
            <thead className="border-b text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Course</th>
                <th className="px-4 py-3 font-medium">Purchased</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="px-4 py-3" colSpan={5}>
                      <Skeleton className="h-5 w-full" />
                    </td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    No purchases yet.
                  </td>
                </tr>
              ) : (
                items.map((row) => (
                  <tr key={row.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/users/${row.user.id}`}
                        className="flex items-center gap-3 hover:underline"
                      >
                        <UserAvatar name={row.user.name} src={row.user.avatarUrl} />
                        <span className="min-w-0">
                          <span className="block truncate font-medium">
                            {row.user.name}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {row.user.email}
                            {row.user.deletedAt ? " · Disabled" : ""}
                          </span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{row.course.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {row.course.deleted ? "Removed from catalog" : row.course.slug}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatAdminDate(row.enrolledAt)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {row.order.orderNumber}
                    </td>
                    <td className="px-4 py-3">
                      {formatAdminMoney(row.order.totalAmount, row.order.currency)}
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
    </div>
  );
}
