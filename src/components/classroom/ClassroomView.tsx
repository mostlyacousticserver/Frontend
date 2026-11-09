"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { LearningAPI } from "@/api/learning";
import { ClassroomHeader } from "@/components/classroom/ClassroomHeader";
import { ClassroomLessonPanel } from "@/components/classroom/ClassroomLessonPanel";
import { ClassroomProgressCard } from "@/components/classroom/ClassroomProgressCard";
import { ClassroomSidebar } from "@/components/classroom/ClassroomSidebar";
import { ClassroomStage } from "@/components/classroom/ClassroomStage";
import { flattenCurriculum, classroomPath } from "@/lib/learning";
import type {
  CourseProgress,
  EnrolledCourseContent,
  EnrolledLesson,
} from "@/types/learning";

type ClassroomViewProps = {
  slug: string;
  lessonId: string;
};

export function ClassroomView({ slug, lessonId }: ClassroomViewProps) {
  const router = useRouter();
  const [content, setContent] = useState<EnrolledCourseContent | null>(null);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [watchedByLesson, setWatchedByLesson] = useState<Record<string, number>>(
    {},
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openModuleIds, setOpenModuleIds] = useState<string[]>([]);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const refreshTimer = useRef<number | null>(null);

  const loadCourse = useCallback(async () => {
    const mine = await LearningAPI.listMyCourses();
    const enrollment = mine.data.items.find((item) => item.course.slug === slug);
    if (!enrollment) {
      router.replace(`/courses/${slug}`);
      return;
    }

    try {
      const [contentRes, progressRes] = await Promise.all([
        LearningAPI.getContent(enrollment.course.id, true),
        LearningAPI.getProgress(enrollment.course.id, true),
      ]);
      setContent(contentRes.data);
      setProgress(progressRes.data);
      setCompletedIds(
        new Set(
          progressRes.data.lessons
            .filter((row) => row.isCompleted)
            .map((row) => row.lessonId),
        ),
      );
      setWatchedByLesson(
        Object.fromEntries(
          progressRes.data.lessons.map((row) => [row.lessonId, row.watchedSeconds]),
        ),
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        router.replace(`/courses/${slug}`);
        return;
      }
      throw error;
    }
  }, [router, slug]);

  useEffect(() => {
    void loadCourse();
  }, [loadCourse]);

  const lessons = useMemo(
    () => (content ? flattenCurriculum(content.modules) : []),
    [content],
  );
  const lesson = lessons.find((item) => item.id === lessonId) ?? null;
  const lessonIndex = lesson ? lessons.findIndex((item) => item.id === lesson.id) : -1;
  const prevLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null;
  const nextLesson =
    lessonIndex >= 0 && lessonIndex < lessons.length - 1
      ? lessons[lessonIndex + 1]
      : null;

  useEffect(() => {
    if (!content || lessons.length === 0) return;
    if (lesson) return;
    const fallback = progress?.continueLessonId ?? lessons[0]?.id ?? null;
    if (fallback) {
      router.replace(classroomPath(slug, fallback));
    }
  }, [content, lesson, lessons, progress?.continueLessonId, router, slug]);

  useEffect(() => {
    if (!content || !lesson) return;
    const moduleId = content.modules.find((module) =>
      module.chapters.some((chapter) =>
        chapter.lessons.some((item) => item.id === lesson.id),
      ),
    )?.id;
    if (moduleId) {
      setOpenModuleIds((current) =>
        current.includes(moduleId) ? current : [...current, moduleId],
      );
    }
  }, [content, lesson]);

  const loadMedia = useCallback(async (current: EnrolledLesson) => {
    if (refreshTimer.current) {
      window.clearTimeout(refreshTimer.current);
      refreshTimer.current = null;
    }
    setMediaUrl(null);
    setMediaError(null);

    if (current.contentType === "text") {
      setMediaLoading(false);
      return;
    }

    if (current.contentType === "video" && current.videoStatus === "FAILED") {
      setMediaLoading(false);
      return;
    }

    if (current.contentType === "video" && !current.hasVideo) {
      setMediaLoading(false);
      setMediaError("This lesson has no video yet.");
      return;
    }
    if (current.contentType === "file" && !current.hasFile) {
      setMediaLoading(false);
      return;
    }

    setMediaLoading(true);
    try {
      const media = await LearningAPI.getLessonMedia(
        current.id,
        current.contentType === "file" ? "file" : "video",
        true,
      );
      setMediaUrl(media.data.url);
      const refreshIn = Math.max((media.data.expiresIn - 30) * 1000, 15_000);
      refreshTimer.current = window.setTimeout(() => {
        void loadMedia(current);
      }, refreshIn);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? Array.isArray(error.response?.data?.message)
          ? error.response.data.message[0]
          : error.response?.data?.message
        : null;
      setMediaError(
        typeof message === "string" ? message : "Unable to load this lesson.",
      );
    } finally {
      setMediaLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!lesson) return;
    void loadMedia(lesson);
    return () => {
      if (refreshTimer.current) window.clearTimeout(refreshTimer.current);
    };
  }, [lesson, loadMedia]);

  const persistProgress = useCallback(
    async (payload: { isCompleted?: boolean; watchedSeconds?: number }) => {
      if (!content || !lesson) return;
      await LearningAPI.updateProgress(content.id, lesson.id, payload);
      if (payload.isCompleted) {
        setCompletedIds((current) => new Set(current).add(lesson.id));
        setProgress((current) =>
          current
            ? {
                ...current,
                completedLessons: Math.min(
                  current.totalLessons,
                  current.completedLessons +
                    (current.lessons.find((row) => row.lessonId === lesson.id)
                      ?.isCompleted
                      ? 0
                      : 1),
                ),
                percentComplete: Math.round(
                  ((current.completedLessons +
                    (current.lessons.find((row) => row.lessonId === lesson.id)
                      ?.isCompleted
                      ? 0
                      : 1)) /
                    Math.max(current.totalLessons, 1)) *
                    100,
                ),
              }
            : current,
        );
      }
      if (payload.watchedSeconds !== undefined) {
        setWatchedByLesson((current) => ({
          ...current,
          [lesson.id]: payload.watchedSeconds ?? 0,
        }));
      }
    },
    [content, lesson],
  );

  const markComplete = useCallback(
    (target: EnrolledLesson, complete = true) => {
      if (!content) return;
      setCompletedIds((current) => {
        const next = new Set(current);
        if (complete) next.add(target.id);
        else next.delete(target.id);
        return next;
      });
      void LearningAPI.updateProgress(content.id, target.id, {
        isCompleted: complete,
      });
    },
    [content],
  );

  function onEnded() {
    void persistProgress({ isCompleted: true });
  }

  function onTimeUpdate(seconds: number) {
    void persistProgress({ watchedSeconds: seconds });
    const duration = lesson?.videoDurationSeconds;
    if (duration && duration > 0 && seconds / duration >= 0.9) {
      void persistProgress({ isCompleted: true, watchedSeconds: seconds });
    }
  }

  async function downloadResource(resourceId: string) {
    const response = await LearningAPI.getResourceDownload(resourceId);
    window.open(response.data.url, "_blank", "noopener,noreferrer");
  }

  if (!content || !lesson) {
    return (
      <div className="flex min-h-svh items-center justify-center text-[#6B7280]">
        Loading course…
      </div>
    );
  }

  const totalLessons = progress?.totalLessons ?? lessons.length;
  const completedCount = completedIds.size;
  const remainingCount = Math.max(totalLessons - completedCount, 0);
  const percent = Math.round(
    (completedCount / Math.max(totalLessons, 1)) * 100,
  );
  const estimatedDays =
    remainingCount > 0
      ? Math.max(
          1,
          Math.ceil(
            lessons
              .filter((item) => !completedIds.has(item.id))
              .reduce(
                (sum, item) => sum + (item.videoDurationSeconds ?? 15 * 60),
                0,
              ) /
              (30 * 60),
          ),
        )
      : null;

  return (
    <div className="flex min-h-svh flex-col">
      <ClassroomHeader
        courseTitle={content.title}
        courseSlug={content.slug}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((open) => !open)}
      />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 gap-4 px-3 py-4 sm:px-5 sm:py-5 lg:gap-5">
        {/* Left curriculum */}
        <aside
          className={`z-30 w-[min(100%,320px)] shrink-0 max-xl:absolute max-xl:inset-y-0 max-xl:left-0 max-xl:bg-[#F5F7F9] max-xl:p-3 max-xl:shadow-2xl xl:relative xl:block ${
            sidebarOpen ? "max-xl:block" : "max-xl:hidden"
          }`}
        >
          <ClassroomSidebar
            slug={slug}
            modules={content.modules}
            currentLessonId={lesson.id}
            completedIds={completedIds}
            openModuleIds={openModuleIds}
            percent={percent}
            completedCount={completedCount}
            remainingCount={remainingCount}
            estimatedDays={estimatedDays}
            onToggleModule={(moduleId) =>
              setOpenModuleIds((current) =>
                current.includes(moduleId)
                  ? current.filter((id) => id !== moduleId)
                  : [...current, moduleId],
              )
            }
            onNavigate={() => setSidebarOpen(false)}
          />
        </aside>

        {sidebarOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-20 bg-black/30 xl:hidden"
            aria-label="Close curriculum"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}

        {/* Center stage */}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <ClassroomStage
            lesson={lesson}
            mediaUrl={mediaUrl}
            loading={mediaLoading}
            error={mediaError}
            startSeconds={watchedByLesson[lesson.id] ?? 0}
            onTimeUpdate={onTimeUpdate}
            onEnded={onEnded}
            onDownloadFile={() => {
              if (mediaUrl) {
                window.open(mediaUrl, "_blank", "noopener,noreferrer");
              }
            }}
          />

          <ClassroomLessonPanel
            lesson={lesson}
            completed={completedIds.has(lesson.id)}
            hasPrev={Boolean(prevLesson)}
            hasNext={Boolean(nextLesson)}
            onPrev={() => {
              if (prevLesson) router.push(classroomPath(slug, prevLesson.id));
            }}
            onNext={() => {
              if (nextLesson) router.push(classroomPath(slug, nextLesson.id));
            }}
            onToggleComplete={() =>
              markComplete(lesson, !completedIds.has(lesson.id))
            }
            onDownloadResource={(resourceId) => {
              void downloadResource(resourceId);
            }}
            onDownloadFile={() => {
              if (mediaUrl) {
                window.open(mediaUrl, "_blank", "noopener,noreferrer");
              }
            }}
          />
        </div>

        {/* Right progress */}
        <aside className="hidden w-[240px] shrink-0 xl:block">
          <div className="sticky top-5">
            <ClassroomProgressCard
              percent={percent}
              completed={completedCount}
              remaining={remainingCount}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
