"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Gauge,
  Inbox,
  IndianRupee,
  ShoppingBag,
  Users,
} from "lucide-react";
import { AdminAPI } from "@/api/admin";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  AdminHero,
  AdminSectionHeading,
  AdminStatCard,
} from "@/components/admin/admin-ui";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminDashboardStats } from "@/types/admin";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

const QUICK_LINKS = [
  {
    href: "/admin/courses",
    title: "Courses",
    description: "Create, publish, and build curriculum.",
    icon: BookOpen,
  },
  {
    href: "/admin/users",
    title: "Students",
    description: "See who signed up and which courses they purchased.",
    icon: Users,
  },
  {
    href: "/admin/purchases",
    title: "Purchases",
    description: "See who bought which course.",
    icon: ShoppingBag,
  },
  {
    href: "/admin/analytics",
    title: "Analytics",
    description: "Revenue trends, signups, and top courses.",
    icon: Gauge,
  },
  {
    href: "/admin/enquiries",
    title: "Enquiries",
    description: "Follow up on Contact Us messages.",
    icon: Inbox,
  },
];

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    AdminAPI.getDashboard()
      .then((response) => {
        if (!cancelled) setStats(response.data);
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

  const cards = stats
    ? [
        {
          title: "Published courses",
          value: String(stats.coursesPublished),
          hint: "Live on the catalog",
          icon: BookOpen,
          tone: "orange" as const,
        },
        {
          title: "Active users",
          value: String(stats.usersActive),
          hint: `${stats.usersTotal} total accounts`,
          icon: Users,
          tone: "teal" as const,
        },
        {
          title: "New enquiries",
          value: String(stats.enquiriesUnread),
          hint: `${stats.enquiriesTotal} total messages`,
          icon: Inbox,
          tone: "navy" as const,
          href: "/admin/enquiries",
        },
        {
          title: "Revenue this month",
          value: formatMoney(stats.revenueThisMonth),
          hint: `${formatMoney(stats.revenueAllTime)} all time`,
          icon: IndianRupee,
          tone: "amber" as const,
          href: "/admin/analytics",
        },
      ]
    : [];

  return (
    <div className="space-y-10">
      <AdminHero>
        <AdminPageHeader
          variant="onDark"
          eyebrow="Studio"
          title="Welcome back"
          description="Manage your courses, videos, and content in one place."
        />
      </AdminHero>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-lg border border-border/60 bg-white p-6 shadow-sm"
              >
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-8 h-10 w-16" />
              </div>
            ))
          : cards.map((card) => {
              const stat = (
                <AdminStatCard
                  label={card.title}
                  value={card.value}
                  hint={card.hint}
                  icon={card.icon}
                  tone={card.tone}
                />
              );
              if ("href" in card && card.href) {
                return (
                  <Link
                    key={card.title}
                    href={card.href}
                    className="block rounded-lg transition-all hover:shadow-md focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:outline-none"
                  >
                    {stat}
                  </Link>
                );
              }
              return <div key={card.title}>{stat}</div>;
            })}
      </div>

      <section className="space-y-6">
        <AdminSectionHeading
          title="Quick Actions"
          description="Jump into the work you do most often."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex flex-col rounded-lg border border-border/60 bg-white p-6 transition-all hover:shadow-md hover:border-brand-teal/30 focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:outline-none"
            >
              <span className="flex size-10 items-center justify-center rounded-md bg-brand-navy/10 text-brand-navy transition-colors group-hover:bg-brand-orange/10 group-hover:text-brand-orange mb-4">
                <link.icon className="size-5" />
              </span>
              <h3 className="font-semibold text-brand-navy mb-2">{link.title}</h3>
              <p className="text-sm leading-5 text-muted-foreground">
                {link.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
