"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CategoryAPI } from "@/api/category";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  categorySchema,
  type CategoryFormValues,
} from "@/lib/validations/category";
import type { CategoryListItem } from "@/types/category";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  AdminHero,
  AdminSearchField,
  AdminSurface,
} from "@/components/admin/admin-ui";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function CategoriesManager() {
  const [categories, setCategories] = useState<CategoryListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryListItem | null>(null);
  const [deleting, setDeleting] = useState<CategoryListItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function loadCategories() {
    const response = await CategoryAPI.list();
    setCategories(response.data);
  }

  useEffect(() => {
    let cancelled = false;

    CategoryAPI.list()
      .then((response) => {
        if (!cancelled) setCategories(response.data);
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
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return categories;
    return categories.filter((category) => {
      return (
        category.name.toLowerCase().includes(term) ||
        category.slug.toLowerCase().includes(term) ||
        (category.description ?? "").toLowerCase().includes(term)
      );
    });
  }, [categories, query]);

  function openCreate() {
    setEditing(null);
    form.reset({ name: "", description: "" });
    setFormOpen(true);
  }

  function openEdit(category: CategoryListItem) {
    setEditing(category);
    form.reset({
      name: category.name,
      description: category.description ?? "",
    });
    setFormOpen(true);
  }

  async function onSubmit(values: CategoryFormValues) {
    const payload = {
      name: values.name.trim(),
      description: values.description?.trim() ?? "",
    };

    setSaving(true);
    try {
      if (editing) {
        await CategoryAPI.update(editing.id, payload);
        toast.success("Category updated");
      } else {
        await CategoryAPI.create(payload);
        toast.success("Category created");
      }
      await loadCategories();
      setFormOpen(false);
      setEditing(null);
    } catch {
      // API error toast handled by axios interceptor
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setRemoving(true);
    try {
      await CategoryAPI.remove(deleting.id);
      toast.success("Category deleted");
      await loadCategories();
      setDeleting(null);
    } catch {
      // API error toast handled by axios interceptor
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="space-y-6">
      <AdminHero>
        <AdminPageHeader
          variant="onDark"
          eyebrow="Catalog"
          title="Categories"
          description="Group courses so students can browse the catalog."
          actions={
            <Button onClick={openCreate}>
              <Plus />
              New category
            </Button>
          }
        />
      </AdminHero>

      <AdminSurface>
        <div className="border-b border-border/80 p-4">
          <AdminSearchField
            value={query}
            onChange={setQuery}
            placeholder="Search categories"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Courses</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="px-4 py-3" colSpan={6}>
                      <Skeleton className="h-5 w-full" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    {query
                      ? "No categories match that search."
                      : "No categories yet. Create one to start grouping courses."}
                  </td>
                </tr>
              ) : (
                filtered.map((category) => {
                  const courseCount = category._count.courses;
                  return (
                    <tr
                      key={category.id}
                      className="border-b last:border-0 hover:bg-muted/30"
                    >
                      <td className="px-4 py-3 font-medium">{category.name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {category.slug}
                      </td>
                      <td className="max-w-[280px] truncate px-4 py-3 text-muted-foreground">
                        {category.description || "—"}
                      </td>
                      <td className="px-4 py-3">{courseCount}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDate(category.updatedAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openEdit(category)}
                            aria-label={`Edit ${category.name}`}
                          >
                            <Pencil />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setDeleting(category)}
                            disabled={courseCount > 0}
                            title={
                              courseCount > 0
                                ? "Cannot delete while courses still use this category"
                                : `Delete ${category.name}`
                            }
                            aria-label={`Delete ${category.name}`}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </AdminSurface>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit category" : "New category"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "The slug updates automatically when you change the name."
                : "The backend generates a unique slug from the name."}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="category-name">Name</Label>
              <Input
                id="category-name"
                placeholder="Fingerstyle"
                {...form.register("name")}
              />
              {form.formState.errors.name ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.name.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-description">Description</Label>
              <Textarea
                id="category-description"
                placeholder="Optional short description"
                rows={4}
                {...form.register("description")}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving
                  ? "Saving…"
                  : editing
                    ? "Save changes"
                    : "Create category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open && !removing) setDeleting(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this category?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting
                ? `“${deleting.name}” will be removed. This cannot be undone.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={removing}
              onClick={(event) => {
                event.preventDefault();
                void confirmDelete();
              }}
            >
              {removing ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
