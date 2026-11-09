"use client";

import { use } from "react";
import { CourseWorkspace } from "@/components/admin/CourseWorkspace";

export default function AdminCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <CourseWorkspace courseId={id} />;
}
