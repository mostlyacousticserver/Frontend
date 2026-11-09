import type { EnrolledLesson, EnrolledModule } from "@/types/learning";

export function flattenCurriculum(modules: EnrolledModule[]): EnrolledLesson[] {
  return modules.flatMap((module) =>
    module.chapters.flatMap((chapter) => chapter.lessons),
  );
}

export function classroomPath(slug: string, lessonId?: string | null) {
  if (!lessonId) return `/learn/${slug}`;
  return `/learn/${slug}/${lessonId}`;
}
