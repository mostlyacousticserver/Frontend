"use client";

import { use, useEffect, useState } from "react";
import { FreeCourseAPI } from "@/api/free-courses";
import { FreeCourseEditor } from "@/components/admin/FreeCourseEditor";
import { Skeleton } from "@/components/ui/skeleton";
import type { FreeCourseDetail } from "@/types/free-course";

export default function AdminEditFreeCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [freeCourse, setFreeCourse] = useState<FreeCourseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    FreeCourseAPI.getAdmin(id)
      .then((response) => {
        if (!cancelled) setFreeCourse(response.data);
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
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[480px] w-full" />
      </div>
    );
  }

  return <FreeCourseEditor freeCourse={freeCourse ?? undefined} />;
}
