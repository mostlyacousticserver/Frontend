"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ExternalLink, HelpCircle, Layers, ListTree } from "lucide-react";
import toast from "react-hot-toast";
import { CourseAPI } from "@/api/course";
import { CourseCurriculum } from "@/components/admin/CourseCurriculum";
import { CourseForm } from "@/components/admin/CourseForm";
import { EntityFaqsEditor } from "@/components/admin/EntityFaqsEditor";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  AdminHero,
  AdminStatCard,
  AdminSurface,
} from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toUpdateCoursePayload } from "@/lib/course-form";
import { formatCoursePrice } from "@/lib/course-utils";
import type { CourseFormValues } from "@/lib/validations/course";
import type { AdminCourseDetail } from "@/types/course";

export function CourseWorkspace({ courseId }: { courseId: string }) {
  const [course, setCourse] = useState<AdminCourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("content");

  async function reload() {
    const response = await CourseAPI.getAdmin(courseId);
    setCourse(response.data);
  }

  useEffect(() => {
    let cancelled = false;
    CourseAPI.getAdmin(courseId)
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
  }, [courseId]);

  async function onSaveDetails(values: CourseFormValues) {
    setSaving(true);
    try {
      await CourseAPI.update(courseId, toUpdateCoursePayload(values));
      toast.success("Course updated");
      await reload();
    } catch {
      // API error toast handled by axios interceptor
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-[480px] w-full" />
      </div>
    );
  }

  if (!course) {
    return <p className="text-sm text-muted-foreground">Course not found.</p>;
  }

  const chapterCount = course.modules.length;
  const moduleCount = course.modules.reduce(
    (sum, module) => sum + module.chapters.length,
    0,
  );
  const lessonCount = course.modules.reduce(
    (sum, module) =>
      sum +
      module.chapters.reduce(
        (chapterSum, chapter) => chapterSum + chapter.lessons.length,
        0,
      ),
    0,
  );

  return (
    <div className="space-y-6">
      <AdminHero>
        <AdminPageHeader
          variant="onDark"
          eyebrow="Curriculum"
          title={course.title}
          description={`${course.category.name} · ${formatCoursePrice(course.price, course.currency)} · ${course.isPublished ? "Published" : "Draft"}`}
          actions={
            <Button asChild>
              <Link href={`/courses/${course.slug}`} target="_blank">
                Preview Course
                <ExternalLink />
              </Link>
            </Button>
          }
        />
      </AdminHero>

      <Tabs value={tab} onValueChange={setTab} className="gap-5">
        <TabsList
          variant="line"
          className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0"
        >
          <TabsTrigger value="overview" className="rounded-none px-4 py-2">
            Overview
          </TabsTrigger>
          <TabsTrigger value="content" className="rounded-none px-4 py-2">
            Content
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-none px-4 py-2">
            Settings
          </TabsTrigger>
          <TabsTrigger value="faqs" className="rounded-none px-4 py-2">
            <HelpCircle className="mr-1.5 size-3.5" />
            FAQs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <AdminStatCard
              label="Chapters"
              value={String(chapterCount)}
              icon={Layers}
              tone="orange"
            />
            <AdminStatCard
              label="Modules"
              value={String(moduleCount)}
              icon={ListTree}
              tone="teal"
            />
            <AdminStatCard
              label="Lessons"
              value={String(lessonCount)}
              icon={BookOpen}
              tone="navy"
            />
          </div>
          <AdminSurface className="p-6">
            <p className="text-sm font-medium text-brand-teal">
              {course.category.name}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{course.shortDescription}</p>
            <p className="mt-4 text-sm font-medium text-brand-navy">
              {formatCoursePrice(course.price, course.currency)}
              <span className="ml-2 text-muted-foreground">
                {course.isPublished ? "Published" : "Draft"}
              </span>
            </p>
          </AdminSurface>
        </TabsContent>

        <TabsContent value="content">
          <CourseCurriculum course={course} onReload={reload} />
        </TabsContent>

        <TabsContent value="settings">
          <AdminSurface className="p-6">
            <CourseForm
              course={course}
              submitting={saving}
              submitLabel="Save settings"
              onSubmit={onSaveDetails}
            />
          </AdminSurface>
        </TabsContent>

        <TabsContent value="faqs">
          <AdminSurface className="p-6">
            <EntityFaqsEditor ownerType="course" ownerId={course.id} />
          </AdminSurface>
        </TabsContent>
      </Tabs>
    </div>
  );
}
