import type { CourseFormValues } from "@/lib/validations/course";
import type { CourseLevel, CreateCourseRequest, UpdateCourseRequest } from "@/types/course";

function optionalText(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function toCreateCoursePayload(
  values: CourseFormValues,
): CreateCourseRequest {
  const discount = values.discountPrice?.trim();
  return {
    title: values.title.trim(),
    categoryId: values.categoryId,
    shortDescription: values.shortDescription.trim(),
    description: values.description.trim(),
    thumbnailUrl: values.thumbnailUrl.trim(),
    price: Number(values.price),
    currency: values.currency.trim() || "INR",
    isPublished: Boolean(values.isPublished),
    isFeatured: Boolean(values.isFeatured),
    isComingSoon: Boolean(values.isComingSoon),
    ...(discount ? { discountPrice: Number(discount) } : {}),
    ...(values.level ? { level: values.level as CourseLevel } : {}),
    ...(optionalText(values.metaTitle)
      ? { metaTitle: values.metaTitle!.trim() }
      : {}),
    ...(optionalText(values.metaDescription)
      ? { metaDescription: values.metaDescription!.trim() }
      : {}),
  };
}

export function toUpdateCoursePayload(
  values: CourseFormValues,
): UpdateCourseRequest {
  const discount = values.discountPrice?.trim();
  return {
    ...toCreateCoursePayload(values),
    discountPrice: discount ? Number(discount) : null,
    level: values.level ? (values.level as CourseLevel) : null,
    metaTitle: optionalText(values.metaTitle) ?? null,
    metaDescription: optionalText(values.metaDescription) ?? null,
  };
}
