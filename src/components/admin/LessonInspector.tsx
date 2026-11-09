"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Clock,
  Eye,
  File,
  MoreVertical,
  Play,
  Trash2,
  Type,
  Video,
  X,
} from "lucide-react";
import { LessonFileUpload } from "@/components/admin/LessonFileUpload";
import { LessonResourceUpload } from "@/components/admin/LessonResourceUpload";
import { LessonArticleField } from "@/components/admin/LessonTextEditor";
import { LessonVideoUpload } from "@/components/admin/LessonVideoUpload";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDuration } from "@/lib/course-utils";
import {
  lessonSchema,
  type LessonFormValues,
  type ResourceFormValues,
} from "@/lib/validations/course";
import { CONTENT_TYPES, type ContentType, type Lesson } from "@/types/course";

function lessonDefaults(lesson: Lesson): LessonFormValues {
  return {
    title: lesson.title,
    contentType: lesson.contentType,
    videoStorageKey: lesson.videoStorageKey ?? "",
    videoDurationSeconds: formatDuration(lesson.videoDurationSeconds) ?? "",
    fileStorageKey: lesson.fileStorageKey ?? "",
    fileType: lesson.fileType ?? "",
    textContent: lesson.textContent ?? "",
    isPreview: lesson.isPreview,
  };
}

export function LessonInspector({
  lesson,
  courseId,
  indexLabel,
  saving,
  onClose,
  onSave,
  onAddResource,
  onDeleteResource,
  onDeleteLesson,
  onReload,
}: {
  lesson: Lesson;
  courseId: string;
  indexLabel: string;
  saving: boolean;
  onClose: () => void;
  onSave: (values: LessonFormValues) => Promise<void>;
  onAddResource: (values: ResourceFormValues) => Promise<void>;
  onDeleteResource: (id: string, title: string) => void;
  onDeleteLesson: () => void;
  onReload?: () => Promise<void>;
}) {
  const [tab, setTab] = useState("details");
  const lessonForm = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: lessonDefaults(lesson),
  });

  useEffect(() => {
    lessonForm.reset(lessonDefaults(lesson));
  }, [lesson, lessonForm]);

  useEffect(() => {
    setTab("details");
  }, [lesson.id]);

  const contentType = lessonForm.watch("contentType");

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-start justify-between gap-2 border-b border-border bg-brand-navy/5 px-4 py-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.16em] text-brand-teal uppercase">
            Lesson {indexLabel}
          </p>
          <h2 className="truncate text-sm font-semibold text-brand-navy">{lesson.title}</h2>
        </div>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="icon-sm">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem variant="destructive" onSelect={onDeleteLesson}>
                Delete lesson
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button type="button" variant="ghost" size="icon-sm" onClick={onClose}>
            <X />
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="min-h-0 flex-1 gap-0">
        <TabsList
          variant="line"
          className="h-auto w-full justify-start rounded-none border-b bg-transparent px-4"
        >
          <TabsTrigger value="details" className="rounded-none px-3 py-2">
            Details
          </TabsTrigger>
          <TabsTrigger value="resources" className="rounded-none px-3 py-2">
            Resources
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-none px-3 py-2">
            Settings
          </TabsTrigger>
        </TabsList>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <TabsContent value="details" className="p-4">
            <form
              className="space-y-4"
              onSubmit={lessonForm.handleSubmit(onSave)}
            >
              <div className="space-y-2">
                <Label>Content Type</Label>
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
                            <span className="flex items-center gap-2 capitalize">
                              {type === "video" ? (
                                <Video className="size-4" />
                              ) : type === "file" ? (
                                <File className="size-4" />
                              ) : (
                                <Type className="size-4" />
                              )}
                              {type}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inspector-title">Title</Label>
                <Input
                  id="inspector-title"
                  {...lessonForm.register("title")}
                />
                {lessonForm.formState.errors.title ? (
                  <p className="text-xs text-destructive">
                    {lessonForm.formState.errors.title.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="inspector-duration">Duration</Label>
                <div className="relative">
                  <Clock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="inspector-duration"
                    className="pl-9"
                    placeholder="08:15"
                    {...lessonForm.register("videoDurationSeconds")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Visibility</Label>
                <Controller
                  control={lessonForm.control}
                  name="isPreview"
                  render={({ field }) => (
                    <Select
                      value={field.value ? "preview" : "published"}
                      onValueChange={(value) =>
                        field.onChange(value === "preview")
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="published">
                          <span className="flex items-center gap-2">
                            <Eye className="size-4" />
                            Published
                          </span>
                        </SelectItem>
                        <SelectItem value="preview">
                          <span className="flex items-center gap-2">
                            <Play className="size-4" />
                            Free preview
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {contentType === "video" ? (
                <LessonVideoUpload
                  lessonId={lesson.id}
                  onDurationSeconds={(seconds) => {
                    lessonForm.setValue(
                      "videoDurationSeconds",
                      formatDuration(seconds) ?? "",
                    );
                  }}
                  onUploaded={() => {
                    void onReload?.();
                  }}
                />
              ) : null}

              {contentType === "text" ? (
                <div className="space-y-2">
                  <Label>Article content</Label>
                  <Controller
                    control={lessonForm.control}
                    name="textContent"
                    render={({ field }) => (
                      <LessonArticleField
                        value={field.value ?? ""}
                        disabled={saving}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {lessonForm.formState.errors.textContent ? (
                    <p className="text-xs text-destructive">
                      {lessonForm.formState.errors.textContent.message}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {contentType === "file" ? (
                <LessonFileUpload
                  courseId={courseId}
                  currentKey={lessonForm.watch("fileStorageKey") ?? ""}
                  currentType={lessonForm.watch("fileType") ?? ""}
                  disabled={saving}
                  onUploaded={(storageKey, fileType) => {
                    lessonForm.setValue("fileStorageKey", storageKey, {
                      shouldDirty: true,
                    });
                    lessonForm.setValue("fileType", fileType, {
                      shouldDirty: true,
                    });
                    void onSave({
                      ...lessonForm.getValues(),
                      fileStorageKey: storageKey,
                      fileType,
                    });
                  }}
                />
              ) : null}

              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Saving…" : "Save details"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4 p-4">
            {lesson.resources.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No resources attached to this lesson.
              </p>
            ) : (
              <ul className="space-y-2">
                {lesson.resources.map((resource) => (
                  <li
                    key={resource.id}
                    className="flex items-center justify-between gap-2 rounded-md border px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {resource.title}
                      </p>
                      <p className="text-xs text-muted-foreground uppercase">
                        {resource.fileType}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() =>
                        onDeleteResource(resource.id, resource.title)
                      }
                    >
                      <Trash2 />
                    </Button>
                  </li>
                ))}
              </ul>
            )}

            <LessonResourceUpload
              courseId={courseId}
              saving={saving}
              onAddResource={onAddResource}
            />
          </TabsContent>

          <TabsContent value="settings" className="p-4">
            <form
              className="space-y-4"
              onSubmit={lessonForm.handleSubmit(onSave)}
            >
              {contentType === "file" ? (
                <div className="space-y-2">
                  <Label htmlFor="inspector-file-key">File storage key</Label>
                  <Input
                    id="inspector-file-key"
                    {...lessonForm.register("fileStorageKey")}
                  />
                </div>
              ) : null}
              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Saving…" : "Save settings"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-destructive hover:text-destructive"
                onClick={onDeleteLesson}
              >
                <Trash2 />
                Delete Lesson
              </Button>
            </form>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
