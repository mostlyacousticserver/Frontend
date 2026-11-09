"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";
import { CourseAPI } from "@/api/course";
import { AdminStatusBadge } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { moveItem } from "@/lib/course-utils";
import type { AdminCourse } from "@/types/course";

const MAX_COURSES = 100;

export function CourseOrderDialog({
  open,
  onOpenChange,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!saving) onOpenChange(next);
      }}
    >
      <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Course display order</DialogTitle>
          <DialogDescription>
            Courses appear on the courses page and homepage in this order. Drafts
            keep their slot and show up once published.
          </DialogDescription>
        </DialogHeader>
        <CourseOrderEditor
          saving={saving}
          onSavingChange={setSaving}
          onCancel={() => onOpenChange(false)}
          onSaved={() => {
            onOpenChange(false);
            onSaved();
          }}
        />

      </DialogContent>
    </Dialog>
  );
}

function CourseOrderEditor({
  saving,
  onSavingChange,
  onCancel,
  onSaved,
}: {
  saving: boolean;
  onSavingChange: (saving: boolean) => void;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    let cancelled = false;

    CourseAPI.listAdmin({ page: 1, limit: MAX_COURSES })
      .then((response) => {
        if (cancelled) return;
        setCourses(response.data.items);
        setTotal(response.data.total);
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

  function move(index: number, direction: -1 | 1) {
    const next = moveItem(courses, index, direction);
    if (!next) return;
    setCourses(next);
    setDirty(true);
  }

  async function save() {
    onSavingChange(true);
    try {
      await CourseAPI.reorder({ orderedIds: courses.map((course) => course.id) });
      toast.success("Course order saved");
      onSaved();
    } catch {
      // API error toast handled by axios interceptor
    } finally {
      onSavingChange(false);
    }
  }

  const tooMany = total > courses.length;

  return (
    <>
      <div className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No courses to order yet.
          </p>
        ) : (
          <ol className="space-y-2">
            {courses.map((course, index) => (
              <li
                key={course.id}
                className="flex items-center gap-3 rounded-lg border border-border/80 bg-background px-3 py-2"
              >
                <span className="w-6 shrink-0 text-center font-mono text-sm text-muted-foreground">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{course.title}</div>
                  <div className="mt-1">
                    <AdminStatusBadge
                      published={course.isPublished}
                      extra={
                        [
                          course.isFeatured ? "Featured" : null,
                          course.isComingSoon ? "Coming soon" : null,
                        ]
                          .filter(Boolean)
                          .join(" · ") || undefined
                      }
                    />
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Move ${course.title} up`}
                    disabled={saving || index === 0}
                    onClick={() => move(index, -1)}
                  >
                    <ChevronUp />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Move ${course.title} down`}
                    disabled={saving || index === courses.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    <ChevronDown />
                  </Button>
                </div>
              </li>
            ))}
          </ol>
        )}
        {tooMany ? (
          <p className="mt-3 text-sm text-brand-orange">
            Only the first {MAX_COURSES} courses can be reordered here.
          </p>
        ) : null}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" disabled={saving} onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="button"
          disabled={saving || loading || !dirty || tooMany}
          onClick={() => void save()}
        >
          {saving ? "Saving…" : "Save order"}
        </Button>
      </DialogFooter>
    </>
  );
}
