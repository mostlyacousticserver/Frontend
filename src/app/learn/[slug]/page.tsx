"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { LearningAPI } from "@/api/learning";
import { classroomPath } from "@/lib/learning";

export default function LearnCourseIndexPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params.slug;

  useEffect(() => {
    let cancelled = false;
    async function redirect() {
      try {
        const mine = await LearningAPI.listMyCourses();
        const enrollment = mine.data.items.find((item) => item.course.slug === slug);
        if (!enrollment) {
          router.replace(`/courses/${slug}`);
          return;
        }
        if (enrollment.continueLessonId) {
          router.replace(classroomPath(slug, enrollment.continueLessonId));
          return;
        }
        const content = await LearningAPI.getContent(enrollment.course.id);
        const first = content.data.modules[0]?.chapters[0]?.lessons[0];
        if (!first) {
          router.replace("/learning");
          return;
        }
        if (!cancelled) {
          router.replace(classroomPath(slug, first.id));
        }
      } catch {
        if (!cancelled) router.replace(`/courses/${slug}`);
      }
    }
    void redirect();
    return () => {
      cancelled = true;
    };
  }, [router, slug]);

  return (
    <div className="flex min-h-svh items-center justify-center text-white/70">
      Opening your course…
    </div>
  );
}
