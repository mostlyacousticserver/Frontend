"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CourseAPI } from "@/api/course";
import { CourseForm } from "@/components/admin/CourseForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminHero, AdminSurface } from "@/components/admin/admin-ui";
import { toCreateCoursePayload } from "@/lib/course-form";
import type { CourseFormValues } from "@/lib/validations/course";

export default function AdminNewCoursePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(values: CourseFormValues) {
    setSubmitting(true);
    try {
      const response = await CourseAPI.create(toCreateCoursePayload(values));
      toast.success("Course created");
      router.push(`/admin/courses/${response.data.id}`);
    } catch {
      // API error toast handled by axios interceptor
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <AdminHero>
        <AdminPageHeader
          variant="onDark"
          eyebrow="Catalog"
          title="New course"
          description="Save the course details, then add modules and lessons on the curriculum page."
        />
      </AdminHero>
      <AdminSurface className="p-6">
        <CourseForm
          submitting={submitting}
          submitLabel="Create course"
          onSubmit={onSubmit}
        />
      </AdminSurface>
    </div>
  );
}
