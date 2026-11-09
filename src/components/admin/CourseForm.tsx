"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { CategoryAPI } from "@/api/category";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CourseThumbnailField } from "@/components/admin/CourseThumbnailField";
import { courseSchema, type CourseFormValues } from "@/lib/validations/course";
import { COURSE_LEVELS, type AdminCourse, type CourseLevel } from "@/types/course";
import type { CategoryListItem } from "@/types/category";

function toFormValues(course?: AdminCourse): CourseFormValues {
  return {
    title: course?.title ?? "",
    categoryId: course?.categoryId ?? "",
    shortDescription: course?.shortDescription ?? "",
    description: course?.description ?? "",
    thumbnailUrl: course?.thumbnailUrl ?? "",
    price: course ? String(course.price) : "0",
    discountPrice:
      course?.discountPrice === null || course?.discountPrice === undefined
        ? ""
        : String(course.discountPrice),
    currency: course?.currency ?? "INR",
    level: course?.level ?? "",
    isPublished: Boolean(course?.isPublished),
    isFeatured: Boolean(course?.isFeatured),
    isComingSoon: Boolean(course?.isComingSoon),
    metaTitle: course?.metaTitle ?? "",
    metaDescription: course?.metaDescription ?? "",
  };
}

export function CourseForm({
  course,
  submitting,
  submitLabel,
  onSubmit,
}: {
  course?: AdminCourse;
  submitting: boolean;
  submitLabel: string;
  onSubmit: (values: CourseFormValues) => Promise<void> | void;
}) {
  const [categories, setCategories] = useState<CategoryListItem[]>([]);
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: toFormValues(course),
  });
  const { reset } = form;

  useEffect(() => {
    CategoryAPI.list()
      .then((response) => setCategories(response.data))
      .catch(() => {
        // API error toast handled by axios interceptor
      });
  }, []);

  useEffect(() => {
    if (course) {
      reset(toFormValues(course));
    }
  }, [course?.id, course?.updatedAt, reset]);

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(onSubmit, () => {
        toast.error("Please fix the highlighted fields before saving.");
      })}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="course-title">Title</Label>
          <Input id="course-title" {...form.register("title")} />
          {form.formState.errors.title ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.title.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Controller
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {form.formState.errors.categoryId ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.categoryId.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label>Level</Label>
          <Controller
            control={form.control}
            name="level"
            render={({ field }) => (
              <Select
                value={field.value || "none"}
                onValueChange={(value) =>
                  field.onChange(value === "none" ? "" : (value as CourseLevel))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Optional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {COURSE_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="course-price">Price</Label>
          <Input
            id="course-price"
            type="number"
            min={0}
            step="0.01"
            {...form.register("price")}
          />
          {form.formState.errors.price ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.price.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="course-discount">Discount price</Label>
          <Input
            id="course-discount"
            type="number"
            min={0}
            step="0.01"
            {...form.register("discountPrice")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="course-currency">Currency</Label>
          <Input id="course-currency" maxLength={3} {...form.register("currency")} />
        </div>

        <Controller
          control={form.control}
          name="thumbnailUrl"
          render={({ field }) => (
            <CourseThumbnailField
              courseId={course?.id}
              value={field.value}
              disabled={submitting}
              error={form.formState.errors.thumbnailUrl?.message}
              onChange={field.onChange}
            />
          )}
        />

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="course-short">Short description</Label>
          <Textarea id="course-short" rows={2} {...form.register("shortDescription")} />
          {form.formState.errors.shortDescription ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.shortDescription.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="course-description">Description</Label>
          <Textarea id="course-description" rows={5} {...form.register("description")} />
          {form.formState.errors.description ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.description.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="course-meta-title">Meta title</Label>
          <Input id="course-meta-title" {...form.register("metaTitle")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="course-meta-description">Meta description</Label>
          <Input id="course-meta-description" {...form.register("metaDescription")} />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <Controller
          control={form.control}
          name="isPublished"
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
              Published
            </label>
          )}
        />
        <Controller
          control={form.control}
          name="isFeatured"
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
              Featured
            </label>
          )}
        />
        <Controller
          control={form.control}
          name="isComingSoon"
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
              Coming soon (upcoming)
            </label>
          )}
        />
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
