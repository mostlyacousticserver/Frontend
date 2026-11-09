"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  AdminStatCard,
  AdminSurface,
} from "@/components/admin/admin-ui";
import { UserAvatar } from "@/components/admin/UserAvatar";
import { formatAdminDate, formatAdminMoney } from "@/lib/admin-format";
import { cn } from "@/lib/utils";
import type { AdminUser, AdminUserDetail } from "@/types/admin";
import { BookOpen, GraduationCap, Receipt } from "lucide-react";

function mergeUser(current: AdminUserDetail, patch: AdminUser): AdminUserDetail {
  return {
    ...current,
    ...patch,
    stats: current.stats,
    enrollments: current.enrollments,
  };
}

export function UserDetail({ userId }: { userId: string }) {
  const { user: sessionUser } = useAuth();
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmDisable, setConfirmDisable] = useState(false);
  const isSelf = sessionUser?.id === userId;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    UsersAPI.getAdmin(userId)
      .then((response) => {
        if (cancelled) return;
        setUser(response.data);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  async function toggleDisabled() {
    if (!user) return;
    setSaving(true);
    try {
      const { data } = user.deletedAt
        ? await UsersAPI.enable(user.id)
        : await UsersAPI.disable(user.id);
      setUser((current) => (current ? mergeUser(current, data) : current));
      setConfirmDisable(false);
      toast.success(data.deletedAt ? "Account disabled" : "Account enabled");
    } catch {
      // interceptor
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!user) {
    return <p className="text-sm text-muted-foreground">User not found.</p>;
  }

  const disabled = Boolean(user.deletedAt);

  return (
    <div className="space-y-6">
      <AdminHero>
        <AdminPageHeader
          variant="onDark"
          eyebrow="People"
          title={user.name}
          description={user.email}
          actions={
            <Button asChild variant="outline" size="sm" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
              <Link href="/admin/users">Back to students</Link>
            </Button>
          }
        />
      </AdminHero>

      <div className="grid gap-4 md:grid-cols-3">
        <AdminStatCard
          label="Courses purchased"
          value={String(user.stats.enrollmentCount)}
          icon={BookOpen}
          tone="orange"
        />
        <AdminStatCard
          label="Orders"
          value={String(user.stats.orderCount)}
          icon={Receipt}
          tone="navy"
        />
        <AdminStatCard
          label="Lessons completed"
          value={String(user.stats.completedLessons)}
          icon={GraduationCap}
          tone="teal"
        />
      </div>

      <AdminSurface className="p-5 md:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <UserAvatar name={user.name} src={user.avatarUrl} />
            <div>
              <p className="font-semibold text-brand-navy">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {user.phone ? (
                <p className="text-sm text-muted-foreground">{user.phone}</p>
              ) : null}
              <p className="mt-2 text-xs text-muted-foreground">
                Joined {formatAdminDate(user.createdAt)} ·{" "}
                {user.authProvider === "google" ? "Google" : "Email"} ·{" "}
                {user.isEmailVerified ? "Email verified" : "Email not verified"}
              </p>
            </div>
          </div>
          <span
            className={cn(
              "w-fit rounded-full px-2.5 py-0.5 text-xs font-medium",
              disabled
                ? "bg-orange-50 text-brand-orange"
                : "bg-teal-50 text-teal-700",
            )}
          >
            {disabled ? "Disabled" : "Active"}
          </span>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-border/80 pt-5 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant={disabled ? "outline" : "destructive"}
            disabled={isSelf || saving}
            onClick={() => {
              if (disabled) {
                void toggleDisabled();
                return;
              }
              setConfirmDisable(true);
            }}
          >
            {disabled ? "Enable account" : "Disable account"}
          </Button>
        </div>
      </AdminSurface>

      <AdminSurface>
        <div className="flex items-center justify-between border-b border-border/80 px-4 py-3">
          <h2 className="font-semibold text-brand-navy">Purchased courses</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href={`/admin/purchases?userId=${user.id}`}>
              View in purchases
            </Link>
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Course</th>
                <th className="px-4 py-3 font-medium">Purchased</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {user.enrollments.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    This user has not purchased any courses yet.
                  </td>
                </tr>
              ) : (
                user.enrollments.map((row) => (
                  <tr key={row.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <div className="font-medium">{row.course.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {row.course.deleted ? "Removed from catalog" : row.course.slug}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatAdminDate(row.enrolledAt)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {row.order.orderNumber}
                    </td>
                    <td className="px-4 py-3">
                      {formatAdminMoney(row.order.totalAmount, row.order.currency)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminSurface>

      <AlertDialog
        open={confirmDisable}
        onOpenChange={(open) => {
          if (!open && !saving) setConfirmDisable(false);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disable this account?</AlertDialogTitle>
            <AlertDialogDescription>
              {user.name} will be signed out and cannot log in until you enable
              the account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={saving}
              onClick={(event) => {
                event.preventDefault();
                void toggleDisabled();
              }}
            >
              {saving ? "Saving…" : "Disable"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
