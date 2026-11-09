import type { SalesGroupBy } from "@/types/admin";

export type AnalyticsPreset = "7d" | "30d" | "90d" | "month";

export function getAnalyticsRange(preset: AnalyticsPreset): {
  from: string;
  to: string;
  groupBy: SalesGroupBy;
  label: string;
} {
  const to = new Date();
  to.setHours(23, 59, 59, 999);

  const from = new Date(to);

  if (preset === "7d") {
    from.setDate(from.getDate() - 6);
    from.setHours(0, 0, 0, 0);
    return {
      from: from.toISOString(),
      to: to.toISOString(),
      groupBy: "day",
      label: "Last 7 days",
    };
  }

  if (preset === "90d") {
    from.setDate(from.getDate() - 89);
    from.setHours(0, 0, 0, 0);
    return {
      from: from.toISOString(),
      to: to.toISOString(),
      groupBy: "week",
      label: "Last 90 days",
    };
  }

  if (preset === "month") {
    from.setDate(1);
    from.setHours(0, 0, 0, 0);
    return {
      from: from.toISOString(),
      to: to.toISOString(),
      groupBy: "day",
      label: "This month",
    };
  }

  from.setDate(from.getDate() - 29);
  from.setHours(0, 0, 0, 0);
  return {
    from: from.toISOString(),
    to: to.toISOString(),
    groupBy: "day",
    label: "Last 30 days",
  };
}

export function formatAnalyticsBucket(
  bucket: string,
  groupBy: SalesGroupBy = "day",
) {
  if (groupBy === "month" && /^\d{4}-\d{2}$/.test(bucket)) {
    const [year, month] = bucket.split("-").map(Number);
    return new Date(year!, month! - 1, 1).toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });
  }

  if (groupBy === "week" || bucket.includes("-W")) {
    return bucket;
  }

  const date = new Date(`${bucket}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return bucket;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}
