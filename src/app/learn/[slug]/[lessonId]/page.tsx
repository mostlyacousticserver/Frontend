"use client";

import { useParams } from "next/navigation";
import { ClassroomView } from "@/components/classroom/ClassroomView";

export default function LearnLessonPage() {
  const params = useParams<{ slug: string; lessonId: string }>();
  return <ClassroomView slug={params.slug} lessonId={params.lessonId} />;
}
