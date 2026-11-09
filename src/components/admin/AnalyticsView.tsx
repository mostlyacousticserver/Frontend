"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  IndianRupee,
  ShoppingBag,
  UserPlus,
  Users,
} from "lucide-react";
import { AdminAPI } from "@/api/admin";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  AdminHero,
  AdminSectionHeading,
  AdminStatCard,
  AdminSurface,
} from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatAnalyticsBucket,
  getAnalyticsRange,
  type AnalyticsPreset,
} from "@/lib/admin-analytics";
import { formatAdminMoney } from "@/lib/admin-format";
import type {
  AdminAnalyticsOverview,
  AdminSalesReport,
  AdminTopCoursesReport,
} from "@/types/admin";

const PRESETS: { id: AnalyticsPreset; label: string }[] = [
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "90d", label: "90 days" },
  { id: "month", label: "This month" },
];

function BarChart({
  points,
  valueKey,
  colorClass,
  emptyLabel,
}: {
  points: Array<{ bucket: string; value: number; label: string }>;
  valueKey: string;
  colorClass: string;
  emptyLabel: string;
}) {
  const max = Math.max(...points.map((point) => point.value), 0);

  if (points.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex h-44 items-end gap-1.5 overflow-x-auto pb-1 sm:gap-2">
        {points.map((point) => {
          const height =
            max <= 0 ? 0 : Math.max(6, Math.round((point.value / max) * 100));
          return (
            <div
              key={`${valueKey}-${point.bucket}`}
              className="flex min-w-[28px] flex-1 flex-col items-center gap-2"
              title={`${point.label}: ${point.value}`}
            >
              <div className="flex h-36 w-full items-end justify-center">
                <div
                  className={`w-full max-w-[36px] rounded-t-md ${colorClass}`}
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="max-w-full truncate text-[10px] text-muted-foreground">
                {point.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AnalyticsView() {
  const [preset, setPreset] = useState<AnalyticsPreset>("30d");
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<AdminAnalyticsOverview | null>(null);
  const [sales, setSales] = useState<AdminSalesReport | null>(null);
  const [topCourses, setTopCourses] = useState<AdminTopCoursesReport | null>(
    null,
  );

  const range = useMemo(() => getAnalyticsRange(preset), [preset]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all([
      AdminAPI.getAnalyticsOverview({ from: range.from, to: range.to }),
      AdminAPI.getSalesReport({
        from: range.from,
        to: range.to,
        groupBy: range.groupBy,
      }),
      AdminAPI.getTopCourses({ from: range.from, to: range.to, limit: 8 }),
    ])
      .then(([overviewRes, salesRes, topRes]) => {
        if (cancelled) return;
        setOverview(overviewRes.data);
        setSales(salesRes.data);
        setTopCourses(topRes.data);
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
  }, [range.from, range.to, range.groupBy]);

  const revenuePoints =
    sales?.series.map((row) => ({
      bucket: row.bucket,
      value: row.revenue,
      label: formatAnalyticsBucket(row.bucket, sales.groupBy),
    })) ?? [];

  const enrollmentPoints =
    overview?.series.map((row) => ({
      bucket: row.bucket,
      value: row.enrollments,
      label: formatAnalyticsBucket(row.bucket, "day"),
    })) ?? [];

  const userPoints =
    overview?.series.map((row) => ({
      bucket: row.bucket,
      value: row.newUsers,
      label: formatAnalyticsBucket(row.bucket, "day"),
    })) ?? [];

  const cards = overview
    ? [
        {
          title: "Revenue",
          value: formatAdminMoney(overview.totals.revenue),
          hint:
            sales && sales.totals.refundedAmount > 0
              ? `${formatAdminMoney(sales.totals.refundedAmount)} refunded`
              : range.label,
          icon: IndianRupee,
          tone: "amber" as const,
        },
        {
          title: "Paid orders",
          value: String(overview.totals.paidOrders),
          hint: sales
            ? `${sales.totals.orderCount} in sales series`
            : "Successful checkouts",
          icon: ShoppingBag,
          tone: "orange" as const,
        },
        {
          title: "New users",
          value: String(overview.totals.newUsers),
          hint: "Accounts created in range",
          icon: UserPlus,
          tone: "teal" as const,
        },
        {
          title: "Enrollments",
          value: String(overview.totals.enrollments),
          hint: "Course unlocks in range",
          icon: Users,
          tone: "navy" as const,
        },
      ]
    : [];

  return (
    <div className="space-y-10">
      <AdminHero>
        <AdminPageHeader
          variant="onDark"
          eyebrow="Insights"
          title="Analytics"
          description="Revenue, signups, enrollments, and top-selling courses for the selected period."
          actions={
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((item) => (
                <Button
                  key={item.id}
                  type="button"
                  size="sm"
                  variant={preset === item.id ? "default" : "secondary"}
                  className={
                    preset === item.id
                      ? "bg-brand-orange text-white hover:bg-brand-orange/90"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }
                  onClick={() => setPreset(item.id)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          }
        />
      </AdminHero>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm"
              >
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-8 h-10 w-20" />
              </div>
            ))
          : cards.map((card) => (
              <AdminStatCard
                key={card.title}
                label={card.title}
                value={card.value}
                hint={card.hint}
                icon={card.icon}
                tone={card.tone}
              />
            ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminSurface className="p-5 md:p-6">
          <AdminSectionHeading
            title="Revenue"
            description={`Grouped by ${sales?.groupBy ?? range.groupBy} · ${range.label}`}
          />
          <div className="mt-5">
            {loading ? (
              <Skeleton className="h-44 w-full" />
            ) : (
              <BarChart
                points={revenuePoints}
                valueKey="revenue"
                colorClass="bg-brand-orange"
                emptyLabel="No paid orders in this period."
              />
            )}
          </div>
        </AdminSurface>

        <AdminSurface className="p-5 md:p-6">
          <AdminSectionHeading
            title="New users"
            description="Daily account creations in the selected range."
          />
          <div className="mt-5">
            {loading ? (
              <Skeleton className="h-44 w-full" />
            ) : (
              <BarChart
                points={userPoints}
                valueKey="users"
                colorClass="bg-brand-teal"
                emptyLabel="No new users in this period."
              />
            )}
          </div>
        </AdminSurface>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminSurface className="p-5 md:p-6">
          <AdminSectionHeading
            title="Enrollments"
            description="Course access granted after purchase or admin grant."
          />
          <div className="mt-5">
            {loading ? (
              <Skeleton className="h-44 w-full" />
            ) : (
              <BarChart
                points={enrollmentPoints}
                valueKey="enrollments"
                colorClass="bg-brand-navy"
                emptyLabel="No enrollments in this period."
              />
            )}
          </div>
        </AdminSurface>

        <AdminSurface className="p-5 md:p-6">
          <AdminSectionHeading
            title="Top courses"
            description="Highest revenue in the selected period."
          />
          <div className="mt-5 space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full" />
              ))
            ) : topCourses && topCourses.items.length > 0 ? (
              topCourses.items.map((row, index) => (
                <div
                  key={row.course.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-white px-3 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-navy/10 text-xs font-semibold text-brand-navy">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-brand-navy">
                        {row.course.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {row.orderCount} sale{row.orderCount === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-brand-navy">
                    {formatAdminMoney(row.revenue)}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <BookOpen className="size-8 text-muted-foreground/60" />
                <p className="text-sm text-muted-foreground">
                  No course sales in this period.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/courses">Manage courses</Link>
                </Button>
              </div>
            )}
          </div>
        </AdminSurface>
      </div>
    </div>
  );
}
