"use client";

import { useEffect, useState } from "react";
import { Eye, Mail, Phone } from "lucide-react";
import { EnquiriesAPI } from "@/api/enquiries";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  AdminHero,
  AdminSearchField,
  AdminSurface,
} from "@/components/admin/admin-ui";
import { formatAdminDateTime } from "@/lib/admin-format";
import { cn } from "@/lib/utils";
import type { AdminEnquiry, AdminEnquiryStatusFilter } from "@/types/admin";

const STATUS_TABS: { value: AdminEnquiryStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "New" },
  { value: "read", label: "Read" },
];

export function EnquiriesList() {
  const [items, setItems] = useState<AdminEnquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AdminEnquiryStatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AdminEnquiry | null>(null);
  const [saving, setSaving] = useState(false);
  const limit = 20;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPage(1);
      setSearch(query.trim());
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    EnquiriesAPI.listAdmin({
      page,
      limit,
      q: search || undefined,
      status,
    })
      .then((response) => {
        if (cancelled) return;
        setItems(response.data.items);
        setTotal(response.data.total);
      })
      .catch(() => {
        // interceptor
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, search, status]);

  function patchEnquiry(updated: AdminEnquiry) {
    const dropsFromList =
      (status === "unread" && updated.isRead) ||
      (status === "read" && !updated.isRead);
    setItems((rows) => {
      const next = rows.map((row) => (row.id === updated.id ? updated : row));
      return dropsFromList
        ? next.filter((row) => row.id !== updated.id)
        : next;
    });
    if (dropsFromList) {
      setTotal((count) => Math.max(0, count - 1));
    }
    setSelected((current) =>
      current?.id === updated.id ? updated : current,
    );
  }

  async function openEnquiry(enquiry: AdminEnquiry) {
    setSelected(enquiry);
    if (enquiry.isRead) return;
    try {
      const { data } = await EnquiriesAPI.updateRead(enquiry.id, true);
      patchEnquiry(data);
    } catch {
      // interceptor
    }
  }

  async function toggleRead() {
    if (!selected) return;
    setSaving(true);
    try {
      const { data } = await EnquiriesAPI.updateRead(
        selected.id,
        !selected.isRead,
      );
      patchEnquiry(data);
    } catch {
      // interceptor
    } finally {
      setSaving(false);
    }
  }

  const pageCount = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-6">
      <AdminHero>
        <AdminPageHeader
          variant="onDark"
          eyebrow="People"
          title="Enquiries"
          description="Messages from the Contact Us page — follow up by email or phone."
        />
      </AdminHero>

      <AdminSurface>
        <div className="flex flex-col gap-3 border-b border-border/80 p-4 sm:flex-row sm:items-center sm:justify-between">
          <AdminSearchField
            value={query}
            onChange={setQuery}
            placeholder="Search name, email, phone, or subject"
          />
          <div className="flex rounded-lg bg-zinc-100 p-0.5">
            {STATUS_TABS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  setStatus(item.value);
                  setPage(1);
                }}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[13px] font-medium",
                  status === item.value
                    ? "bg-white text-brand-navy shadow-sm"
                    : "text-zinc-500 hover:text-brand-navy",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="border-b text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Received</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="px-4 py-3" colSpan={6}>
                      <Skeleton className="h-5 w-full" />
                    </td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    No enquiries yet.
                  </td>
                </tr>
              ) : (
                items.map((enquiry) => (
                  <tr
                    key={enquiry.id}
                    className={cn(
                      "border-b last:border-0 hover:bg-muted/30",
                      !enquiry.isRead && "bg-sky-50/60",
                    )}
                  >
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatAdminDateTime(enquiry.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-medium">{enquiry.name}</td>
                    <td className="px-4 py-3">
                      <div>{enquiry.email}</div>
                      <div className="text-xs text-muted-foreground">
                        {enquiry.phone || "No phone"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="max-w-[280px] truncate">
                        {enquiry.subject}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-medium",
                          enquiry.isRead
                            ? "bg-zinc-100 text-zinc-600"
                            : "bg-teal-50 text-teal-700",
                        )}
                      >
                        {enquiry.isRead ? "Read" : "New"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`View enquiry from ${enquiry.name}`}
                          onClick={() => void openEnquiry(enquiry)}
                        >
                          <Eye />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminSurface>

      {pageCount > 1 ? (
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((current) => current - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {pageCount}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= pageCount}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </div>
      ) : null}

      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle>{selected.subject}</DialogTitle>
                <DialogDescription>
                  {formatAdminDateTime(selected.createdAt)} ·{" "}
                  {selected.isRead ? "Read" : "New"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium text-brand-navy">{selected.name}</p>
                  <a
                    href={`mailto:${selected.email}`}
                    className="mt-1 inline-flex items-center gap-1.5 text-brand-navy hover:underline"
                  >
                    <Mail className="size-3.5" />
                    {selected.email}
                  </a>
                  {selected.phone ? (
                    <a
                      href={`tel:${selected.phone.replace(/\s+/g, "")}`}
                      className="mt-1 flex items-center gap-1.5 text-brand-navy hover:underline"
                    >
                      <Phone className="size-3.5" />
                      {selected.phone}
                    </a>
                  ) : (
                    <p className="mt-1 text-muted-foreground">No phone number</p>
                  )}
                </div>
                <p className="whitespace-pre-wrap leading-6 text-brand-navy">
                  {selected.message}
                </p>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  disabled={saving}
                  onClick={() => void toggleRead()}
                >
                  {selected.isRead ? "Mark as new" : "Mark as read"}
                </Button>
                <Button asChild>
                  <a href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}>
                    Reply by email
                  </a>
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
