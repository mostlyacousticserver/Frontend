"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CourseAPI } from "@/api/course";
import { CourseForm } from "@/components/admin/CourseForm";
import { EntityFaqsEditor } from "@/components/admin/EntityFaqsEditor";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminHero, AdminSurface } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toUpdateCoursePayload } from "@/lib/course-form";
import type { CourseFormValues } from "@/lib/validations/course";
import type { AdminCourse } from "@/types/course";

export default function AdminEditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [course, setCourse] = useState<AdminCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    CourseAPI.getAdmin(id)
      .then((response) => {
        if (!cancelled) setCourse(response.data);
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
  }, [id]);

  async function onSubmit(values: CourseFormValues) {
    setSubmitting(true);
    try {
      await CourseAPI.update(id, toUpdateCoursePayload(values));
      toast.success("Course updated");
      router.push(`/admin/courses/${id}`);
    } catch {
      // API error toast handled by axios interceptor
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!course) {
    return <p className="text-sm text-muted-foreground">Course not found.</p>;
  }

  return (
    <div className="space-y-6">
      <AdminHero>
        <AdminPageHeader
          variant="onDark"
          eyebrow="Catalog"
          title="Edit course"
          description={course.title}
          actions={
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <Link href={`/admin/courses/${id}`}>Back to curriculum</Link>
            </Button>
          }
        />
      </AdminHero>
      <AdminSurface className="p-6">
        <CourseForm
          course={course}
          submitting={submitting}
          submitLabel="Save changes"
          onSubmit={onSubmit}
        />
      </AdminSurface>
      <AdminSurface className="p-6">
        <EntityFaqsEditor ownerType="course" ownerId={course.id} />
      </AdminSurface>
    </div>
  );
}
