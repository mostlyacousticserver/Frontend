"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronDown,
  ChevronUp,
  File,
  Folder,
  GripVertical,
  MoreVertical,
  Play,
  Plus,
  Type,
} from "lucide-react";
import toast from "react-hot-toast";
import { CourseContentAPI } from "@/api/course";
import { LessonInspector } from "@/components/admin/LessonInspector";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  formatDuration,
  moveItem,
  parseDurationToSeconds,
} from "@/lib/course-utils";
import {
  lessonSchema,
  titleSchema,
  type LessonFormValues,
  type ResourceFormValues,
  type TitleFormValues,
} from "@/lib/validations/course";
import {
  CONTENT_TYPES,
  type AdminCourseDetail,
  type Chapter,
  type ContentType,
  type CourseModule,
  type Lesson,
} from "@/types/course";

type TitleDialogState =
  | { kind: "chapter"; mode: "create" }
  | { kind: "chapter"; mode: "edit"; id: string; title: string }
  | { kind: "module"; mode: "create"; chapterId: string }
  | { kind: "module"; mode: "edit"; id: string; title: string };

type LessonCreateState = { chapterId: string };

type DeleteTarget = {
  kind: "chapter" | "module" | "lesson" | "resource";
  id: string;
  label: string;
};

function lessonCreateDefaults(): LessonFormValues {
  return {
    title: "",
    contentType: "video",
    videoStorageKey: "",
    videoDurationSeconds: "",
    fileStorageKey: "",
    fileType: "",
    textContent: "",
    isPreview: false,
  };
}

function findLesson(
  course: AdminCourseDetail,
  lessonId: string,
): { lesson: Lesson; indexLabel: string } | null {
  for (const [moduleIndex, module] of course.modules.entries()) {
    for (const [chapterIndex, chapter] of module.chapters.entries()) {
      const lessonIndex = chapter.lessons.findIndex(
        (item) => item.id === lessonId,
      );
      if (lessonIndex >= 0) {
        const lesson = chapter.lessons[lessonIndex];
        if (!lesson) return null;
        return {
          lesson,
          indexLabel: `${moduleIndex + 1}.${chapterIndex + 1}.${lessonIndex + 1}`,
        };
      }
    }
  }
  return null;
}

export function CourseCurriculum({
  course,
  onReload,
}: {
  course: AdminCourseDetail;
  onReload: () => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(
    null,
  );
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [compact, setCompact] = useState(false);
  const [titleDialog, setTitleDialog] = useState<TitleDialogState | null>(null);
  const [lessonCreate, setLessonCreate] = useState<LessonCreateState | null>(
    null,
  );
  const [deleting, setDeleting] = useState<DeleteTarget | null>(null);

  const titleForm = useForm<TitleFormValues>({
    resolver: zodResolver(titleSchema),
    defaultValues: { title: "" },
  });
  const lessonForm = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: lessonCreateDefaults(),
  });

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!titleDialog) return;
    titleForm.reset({
      title: titleDialog.mode === "edit" ? titleDialog.title : "",
    });
  }, [titleDialog, titleForm]);

  useEffect(() => {
    if (!lessonCreate) return;
    lessonForm.reset(lessonCreateDefaults());
  }, [lessonCreate, lessonForm]);

  const selected = useMemo(
    () =>
      selectedLessonId ? findLesson(course, selectedLessonId) : null,
    [course, selectedLessonId],
  );

  function lastChapter(): CourseModule | undefined {
    return (
      course.modules.find((item) => item.id === selectedChapterId) ??
      course.modules.at(-1)
    );
  }

  function lastModule(): Chapter | undefined {
    if (selectedModuleId) {
      for (const module of course.modules) {
        const chapter = module.chapters.find(
          (item) => item.id === selectedModuleId,
        );
        if (chapter) return chapter;
      }
    }
    const chapter = lastChapter();
    return chapter?.chapters.at(-1);
  }

  async function saveTitle(values: TitleFormValues) {
    if (!titleDialog) return;
    setSaving(true);
    try {
      if (titleDialog.kind === "chapter" && titleDialog.mode === "create") {
        await CourseContentAPI.createModule(course.id, {
          title: values.title,
        });
        toast.success("Chapter created");
      } else if (titleDialog.kind === "chapter" && titleDialog.mode === "edit") {
        await CourseContentAPI.updateModule(titleDialog.id, {
          title: values.title,
        });
        toast.success("Chapter updated");
      } else if (titleDialog.kind === "module" && titleDialog.mode === "create") {
        await CourseContentAPI.createChapter(titleDialog.chapterId, {
          title: values.title,
        });
        toast.success("Module created");
      } else if (titleDialog.kind === "module" && titleDialog.mode === "edit") {
        await CourseContentAPI.updateChapter(titleDialog.id, {
          title: values.title,
        });
        toast.success("Module updated");
      }
      await onReload();
      setTitleDialog(null);
    } catch {
      // API error toast handled by axios interceptor
    } finally {
      setSaving(false);
    }
  }

  async function createLesson(values: LessonFormValues) {
    if (!lessonCreate) return;
    setSaving(true);
    try {
      const created = await CourseContentAPI.createLesson(lessonCreate.chapterId, {
        title: values.title.trim(),
        contentType: values.contentType,
        isPreview: false,
      });
      toast.success("Lesson created");
      await onReload();
      setLessonCreate(null);
      setSelectedLessonId(created.data.id);
    } catch {
      // API error toast handled by axios interceptor
    } finally {
      setSaving(false);
    }
  }

  async function saveLesson(values: LessonFormValues) {
    if (!selected) return;
    const rawDuration = values.videoDurationSeconds?.trim() ?? "";
    const duration = rawDuration ? parseDurationToSeconds(rawDuration) : null;
    if (rawDuration && duration === null) {
      toast.error("Use duration as MM:SS or total seconds");
      return;
    }
    setSaving(true);
    try {
      await CourseContentAPI.updateLesson(selected.lesson.id, {
        title: values.title.trim(),
        contentType: values.contentType,
        isPreview: values.isPreview ?? false,
        videoStorageKey: values.videoStorageKey?.trim() || null,
        fileStorageKey: values.fileStorageKey?.trim() || null,
        fileType: values.fileType?.trim() || null,
        textContent: values.textContent?.trim() || null,
        videoDurationSeconds: duration,
      });
      toast.success("Lesson updated");
      await onReload();
    } catch {
      // API error toast handled by axios interceptor
    } finally {
      setSaving(false);
    }
  }

  async function addResource(values: ResourceFormValues) {
    if (!selected) return;
    setSaving(true);
    try {
      await CourseContentAPI.createResource(selected.lesson.id, {
        title: values.title.trim(),
        fileStorageKey: values.fileStorageKey.trim(),
        fileType: values.fileType.trim(),
      });
      toast.success("Resource added");
      await onReload();
    } catch {
      // API error toast handled by axios interceptor
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setSaving(true);
    try {
      if (deleting.kind === "chapter") {
        await CourseContentAPI.deleteModule(deleting.id);
      } else if (deleting.kind === "module") {
        await CourseContentAPI.deleteChapter(deleting.id);
      } else if (deleting.kind === "lesson") {
        await CourseContentAPI.deleteLesson(deleting.id);
        setSelectedLessonId((current) =>
          current === deleting.id ? null : current,
        );
      } else {
        await CourseContentAPI.deleteResource(deleting.id);
      }
      toast.success(
        `${deleting.kind.charAt(0).toUpperCase()}${deleting.kind.slice(1)} deleted`,
      );
      await onReload();
      setDeleting(null);
    } catch {
      // API error toast handled by axios interceptor
    } finally {
      setSaving(false);
    }
  }

  async function moveChapters(index: number, direction: -1 | 1) {
    const next = moveItem(course.modules, index, direction);
    if (!next) return;
    try {
      await CourseContentAPI.reorderModules(course.id, {
        orderedIds: next.map((item) => item.id),
      });
      await onReload();
    } catch {
      // API error toast handled by axios interceptor
    }
  }

  async function moveModules(
    chapterId: string,
    chapters: Chapter[],
    index: number,
    direction: -1 | 1,
  ) {
    const next = moveItem(chapters, index, direction);
    if (!next) return;
    try {
      await CourseContentAPI.reorderChapters(chapterId, {
        orderedIds: next.map((item) => item.id),
      });
      await onReload();
    } catch {
      // API error toast handled by axios interceptor
    }
  }

  async function moveLessons(
    moduleId: string,
    lessons: Lesson[],
    index: number,
    direction: -1 | 1,
  ) {
    const next = moveItem(lessons, index, direction);
    if (!next) return;
    try {
      await CourseContentAPI.reorderLessons(moduleId, {
        orderedIds: next.map((item) => item.id),
      });
      await onReload();
    } catch {
      // API error toast handled by axios interceptor
    }
  }

  function openAddChapter() {
    setTitleDialog({ kind: "chapter", mode: "create" });
  }

  function openAddModule(chapterId?: string) {
    const targetId = chapterId ?? lastChapter()?.id;
    if (!targetId) {
      toast.error("Add a chapter first");
      return;
    }
    setTitleDialog({ kind: "module", mode: "create", chapterId: targetId });
  }

  function openAddLesson(moduleId?: string) {
    const targetId = moduleId ?? lastModule()?.id;
    if (!targetId) {
      toast.error("Add a module first");
      return;
    }
    setLessonCreate({ chapterId: targetId });
  }

  const inspector = selected ? (
    <LessonInspector
      lesson={selected.lesson}
      courseId={course.id}
      indexLabel={selected.indexLabel}
      saving={saving}
      onClose={() => setSelectedLessonId(null)}
      onSave={saveLesson}
      onAddResource={addResource}
      onDeleteResource={(id, label) =>
        setDeleting({ kind: "resource", id, label })
      }
      onDeleteLesson={() =>
        setDeleting({
          kind: "lesson",
          id: selected.lesson.id,
          label: selected.lesson.title,
        })
      }
      onReload={onReload}
    />
  ) : (
    <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
      Select a lesson to view and edit its details.
    </div>
  );

  return (
    <div className="flex gap-6">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Organize your course content in chapters, modules and lessons.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={openAddChapter}>
              <Plus />
              Add Chapter
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  className="bg-brand-orange text-white hover:bg-brand-orange-hover"
                >
                  <Plus />
                  Add Content
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={openAddChapter}>
                  Add chapter
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => openAddModule()}>
                  Add module
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => openAddLesson()}>
                  Add lesson
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {course.modules.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-teal/40 bg-card px-6 py-10 text-center text-sm text-muted-foreground">
            No chapters yet. Add a chapter to start structuring this course.
          </div>
        ) : (
          <div className="space-y-3">
            {course.modules.map((module, moduleIndex) => (
              <Collapsible
                key={module.id}
                defaultOpen
                className="overflow-hidden rounded-2xl border border-border/80"
              >
                <div
                  className="flex items-center gap-2 bg-teal-50 px-3 py-3"
                  onClick={() => setSelectedChapterId(module.id)}
                >
                  <CollapsibleTrigger className="group flex min-w-0 flex-1 items-center gap-3 text-left">
                    <ChevronDown className="size-4 shrink-0 text-brand-navy transition-transform group-data-[state=closed]:-rotate-90" />
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white text-brand-navy shadow-sm">
                      <Folder className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">
                        Chapter {moduleIndex + 1}: {module.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {module.chapters.length}{" "}
                        {module.chapters.length === 1 ? "Module" : "Modules"}
                      </span>
                    </span>
                  </CollapsibleTrigger>
                  <RowMenu
                    onRename={() =>
                      setTitleDialog({
                        kind: "chapter",
                        mode: "edit",
                        id: module.id,
                        title: module.title,
                      })
                    }
                    onAddChild={() => openAddModule(module.id)}
                    addChildLabel="Add module"
                    canMoveUp={moduleIndex > 0}
                    canMoveDown={moduleIndex < course.modules.length - 1}
                    onMoveUp={() => void moveChapters(moduleIndex, -1)}
                    onMoveDown={() => void moveChapters(moduleIndex, 1)}
                    onDelete={() =>
                      setDeleting({
                        kind: "chapter",
                        id: module.id,
                        label: module.title,
                      })
                    }
                  />
                </div>
                <CollapsibleContent className="space-y-1 bg-card py-2">
                  {module.chapters.length === 0 ? (
                    <p className="px-4 py-2 text-sm text-muted-foreground">
                      No modules in this chapter.
                    </p>
                  ) : (
                    module.chapters.map((chapter, chapterIndex) => (
                      <div key={chapter.id} className="px-2">
                        <div
                          className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-muted/50"
                          onClick={() => {
                            setSelectedChapterId(module.id);
                            setSelectedModuleId(chapter.id);
                          }}
                        >
                          <GripVertical className="size-4 shrink-0 text-muted-foreground" />
                          <Folder className="size-4 shrink-0 text-brand-teal" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                              Module {moduleIndex + 1}.{chapterIndex + 1}:{" "}
                              {chapter.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {chapter.lessons.length}{" "}
                              {chapter.lessons.length === 1
                                ? "Lesson"
                                : "Lessons"}
                            </p>
                          </div>
                          <RowMenu
                            onRename={() =>
                              setTitleDialog({
                                kind: "module",
                                mode: "edit",
                                id: chapter.id,
                                title: chapter.title,
                              })
                            }
                            onAddChild={() => openAddLesson(chapter.id)}
                            addChildLabel="Add lesson"
                            canMoveUp={chapterIndex > 0}
                            canMoveDown={
                              chapterIndex < module.chapters.length - 1
                            }
                            onMoveUp={() =>
                              void moveModules(
                                module.id,
                                module.chapters,
                                chapterIndex,
                                -1,
                              )
                            }
                            onMoveDown={() =>
                              void moveModules(
                                module.id,
                                module.chapters,
                                chapterIndex,
                                1,
                              )
                            }
                            onDelete={() =>
                              setDeleting({
                                kind: "module",
                                id: chapter.id,
                                label: chapter.title,
                              })
                            }
                          />
                        </div>
                        <div className="ml-8 space-y-1 pb-2">
                          {chapter.lessons.length === 0 ? (
                            <p className="px-2 py-1 text-sm text-muted-foreground">
                              No lessons in this module.
                            </p>
                          ) : (
                            chapter.lessons.map((lesson, lessonIndex) => {
                              const duration = formatDuration(
                                lesson.videoDurationSeconds,
                              );
                              const active = lesson.id === selectedLessonId;
                              return (
                                <div
                                  key={lesson.id}
                                  role="button"
                                  tabIndex={0}
                                  className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-left ${
                                    active
                                      ? "bg-teal-50"
                                      : "hover:bg-muted/50"
                                  }`}
                                  onClick={() => {
                                    setSelectedChapterId(module.id);
                                    setSelectedModuleId(chapter.id);
                                    setSelectedLessonId(lesson.id);
                                  }}
                                  onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                      event.preventDefault();
                                      setSelectedChapterId(module.id);
                                      setSelectedModuleId(chapter.id);
                                      setSelectedLessonId(lesson.id);
                                    }
                                  }}
                                >
                                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-orange-50 text-brand-orange">
                                    {lesson.contentType === "video" ? (
                                      <Play className="size-3.5 fill-current" />
                                    ) : lesson.contentType === "text" ? (
                                      <Type className="size-3.5" />
                                    ) : (
                                      <File className="size-3.5" />
                                    )}
                                  </span>
                                  <span className="min-w-0 flex-1 truncate text-sm">
                                    Lesson {moduleIndex + 1}.{chapterIndex + 1}.
                                    {lessonIndex + 1}: {lesson.title}
                                  </span>
                                  {duration ? (
                                    <span className="hidden text-xs text-muted-foreground sm:inline">
                                      {duration}
                                    </span>
                                  ) : null}
                                  <Badge
                                    variant="outline"
                                    className="capitalize"
                                  >
                                    {lesson.contentType}
                                  </Badge>
                                  <span
                                    onClick={(event) => event.stopPropagation()}
                                    onKeyDown={(event) =>
                                      event.stopPropagation()
                                    }
                                  >
                                    <RowMenu
                                      onRename={() =>
                                        setSelectedLessonId(lesson.id)
                                      }
                                      renameLabel="Edit details"
                                      canMoveUp={lessonIndex > 0}
                                      canMoveDown={
                                        lessonIndex < chapter.lessons.length - 1
                                      }
                                      onMoveUp={() =>
                                        void moveLessons(
                                          chapter.id,
                                          chapter.lessons,
                                          lessonIndex,
                                          -1,
                                        )
                                      }
                                      onMoveDown={() =>
                                        void moveLessons(
                                          chapter.id,
                                          chapter.lessons,
                                          lessonIndex,
                                          1,
                                        )
                                      }
                                      onDelete={() =>
                                        setDeleting({
                                          kind: "lesson",
                                          id: lesson.id,
                                          label: lesson.title,
                                        })
                                      }
                                    />
                                  </span>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-brand-teal/40 px-4 py-3 text-sm font-medium text-brand-navy hover:bg-teal-50"
          onClick={openAddChapter}
        >
          <Plus className="size-4" />
          Add Chapter
        </button>
      </div>

      {!compact ? (
        <aside className="h-[calc(100vh-8rem)] w-[340px] shrink-0 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
          {inspector}
        </aside>
      ) : (
        <Sheet
          open={Boolean(selected)}
          onOpenChange={(open) => {
            if (!open) setSelectedLessonId(null);
          }}
        >
          <SheetContent
            className="w-full p-0 sm:max-w-md"
            showCloseButton={false}
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Lesson details</SheetTitle>
            </SheetHeader>
            {inspector}
          </SheetContent>
        </Sheet>
      )}

      <Dialog
        open={Boolean(titleDialog)}
        onOpenChange={(open) => {
          if (!open) setTitleDialog(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {titleDialog?.mode === "edit" ? "Rename" : "Create"}{" "}
              {titleDialog?.kind ?? "item"}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={titleForm.handleSubmit(saveTitle)}>
            <div className="space-y-2">
              <Label htmlFor="item-title">Title</Label>
              <Input id="item-title" {...titleForm.register("title")} />
              {titleForm.formState.errors.title ? (
                <p className="text-xs text-destructive">
                  {titleForm.formState.errors.title.message}
                </p>
              ) : null}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(lessonCreate)}
        onOpenChange={(open) => {
          if (!open) setLessonCreate(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New lesson</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={lessonForm.handleSubmit(createLesson)}
          >
            <div className="space-y-2">
              <Label htmlFor="new-lesson-title">Title</Label>
              <Input id="new-lesson-title" {...lessonForm.register("title")} />
            </div>
            <div className="space-y-2">
              <Label>Content type</Label>
              <Controller
                control={lessonForm.control}
                name="contentType"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) =>
                      field.onChange(value as ContentType)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          <span className="capitalize">{type}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving ? "Creating…" : "Create lesson"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open && !saving) setDeleting(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleting?.kind}?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting
                ? `“${deleting.label}” will be removed. Nested content is deleted with it.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={saving}
              onClick={(event) => {
                event.preventDefault();
                void confirmDelete();
              }}
            >
              {saving ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function RowMenu({
  onRename,
  renameLabel = "Rename",
  onAddChild,
  addChildLabel,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  onRename: () => void;
  renameLabel?: string;
  onAddChild?: () => void;
  addChildLabel?: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={(event) => event.stopPropagation()}
        >
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}>
        <DropdownMenuItem onSelect={onRename}>{renameLabel}</DropdownMenuItem>
        {onAddChild ? (
          <DropdownMenuItem onSelect={onAddChild}>{addChildLabel}</DropdownMenuItem>
        ) : null}
        <DropdownMenuItem disabled={!canMoveUp} onSelect={onMoveUp}>
          <ChevronUp />
          Move up
        </DropdownMenuItem>
        <DropdownMenuItem disabled={!canMoveDown} onSelect={onMoveDown}>
          <ChevronDown />
          Move down
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={onDelete}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
