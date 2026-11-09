"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Ban, CheckCircle2, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { UsersAPI } from "@/api/users";
import { useAuth } from "@/contexts/AuthContext";
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
import { Skeleton } from "@/components/ui/skeleton";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  AdminHero,
  AdminSearchField,
  AdminSurface,
} from "@/components/admin/admin-ui";
import {
  formatAdminDate,
} from "@/lib/admin-format";
import { UserAvatar } from "@/components/admin/UserAvatar";
import { cn } from "@/lib/utils";
import type { AdminUser, AdminUserStatusFilter } from "@/types/admin";

const STATUS_TABS: { value: AdminUserStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "disabled", label: "Disabled" },
];

export function UsersList() {
  const router = useRouter();
  const { user: sessionUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AdminUserStatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<AdminUser | null>(null);
  const [busy, setBusy] = useState(false);
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
    UsersAPI.listAdmin({
      page,
      limit,
      q: search || undefined,
      status,
    })
      .then((response) => {
        if (cancelled) return;
        setUsers(response.data.items);
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

  async function confirmStatusChange() {
    if (!pending) return;
    setBusy(true);
    try {
      if (pending.deletedAt) {
        await UsersAPI.enable(pending.id);
        toast.success("Account enabled");
      } else {
        await UsersAPI.disable(pending.id);
        toast.success("Account disabled");
      }
      setPending(null);
      const response = await UsersAPI.listAdmin({
        page,
        limit,
        q: search || undefined,
        status,
      });
      setUsers(response.data.items);
      setTotal(response.data.total);
    } catch {
      // interceptor
    } finally {
      setBusy(false);
    }
  }

  const pageCount = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-6">
      <AdminHero>
        <AdminPageHeader
          variant="onDark"
          eyebrow="People"
          title="Students"
          description="People who signed up as students — disable accounts and see which courses they purchased."
        />
      </AdminHero>

      <AdminSurface>
        <div className="flex flex-col gap-3 border-b border-border/80 p-4">
          <AdminSearchField
            value={query}
            onChange={setQuery}
            placeholder="Search by name or email"
          />
          <div className="flex flex-wrap gap-2">
            <FilterPills
              items={STATUS_TABS}
              value={status}
              onChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="border-b text-left">
              <tr>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Courses</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="px-4 py-3" colSpan={5}>
                      <Skeleton className="h-5 w-full" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    No students match these filters.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const disabled = Boolean(user.deletedAt);
                  const isSelf = sessionUser?.id === user.id;
                  return (
                    <tr
                      key={user.id}
                      className="border-b last:border-0 hover:bg-muted/30"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <UserAvatar name={user.name} src={user.avatarUrl} />
                          <div className="min-w-0">
                            <div className="truncate font-medium">
                              {user.name}
                            </div>
                            <div className="truncate text-xs text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/purchases?userId=${user.id}`}
                          className="font-medium text-brand-navy hover:underline"
                        >
                          {user._count?.enrollments ?? 0}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatAdminDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-xs font-medium",
                            disabled
                              ? "bg-orange-50 text-brand-orange"
                              : "bg-teal-50 text-teal-700",
                          )}
                        >
                          {disabled ? "Disabled" : "Active"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`View ${user.name}`}
                            onClick={() =>
                              router.push(`/admin/users/${user.id}`)
                            }
                          >
                            <Eye />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={
                              disabled
                                ? `Enable ${user.name}`
                                : `Disable ${user.name}`
                            }
                            disabled={isSelf}
                            onClick={() => setPending(user)}
                          >
                            {disabled ? <CheckCircle2 /> : <Ban />}
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

      <AlertDialog
        open={Boolean(pending)}
        onOpenChange={(open) => {
          if (!open && !busy) setPending(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pending?.deletedAt ? "Enable this account?" : "Disable this account?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pending?.deletedAt
                ? `${pending.name} will be able to sign in again.`
                : pending
                  ? `${pending.name} will be signed out and cannot log in until you enable the account.`
                  : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant={pending?.deletedAt ? "default" : "destructive"}
              disabled={busy}
              onClick={(event) => {
                event.preventDefault();
                void confirmStatusChange();
              }}
            >
              {busy
                ? "Saving…"
                : pending?.deletedAt
                  ? "Enable"
                  : "Disable"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function FilterPills<T extends string>({
  items,
  value,
  onChange,
}: {
  items: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex rounded-lg bg-zinc-100 p-0.5">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
          className={cn(
            "rounded-md px-2.5 py-1 text-[13px] font-medium",
            value === item.value
              ? "bg-white text-brand-navy shadow-sm"
              : "text-zinc-500 hover:text-brand-navy",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
