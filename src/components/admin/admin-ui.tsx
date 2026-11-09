import type { ReactNode } from "react";
import { Search, type LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function isAdminWorkspace(pathname: string) {
  if (
    pathname === "/admin/songs/new" ||
    pathname === "/admin/blogs/new" ||
    pathname === "/admin/free-courses/new"
  ) {
    return true;
  }
  return /^\/admin\/(songs|blogs|free-courses)\/[0-9a-f-]{36}$/i.test(pathname);
}

export function AdminHero({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl bg-brand-navy px-6 py-7 text-white shadow-[0_18px_40px_rgb(11_31_58_/_0.18)] md:px-8",
        className,
      )}
    >
      <div className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full bg-brand-orange/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-10 size-56 rounded-full bg-brand-teal/20 blur-3xl" />
      <div className="relative">{children}</div>
    </section>
  );
}

export function AdminSurface({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AdminStatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "orange",
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  tone?: "orange" | "teal" | "navy" | "amber";
}) {
  const tones = {
    orange: {
      iconWrap: "bg-orange-50 text-brand-orange",
      glow: "from-brand-orange/20",
    },
    teal: {
      iconWrap: "bg-teal-50 text-teal-700",
      glow: "from-brand-teal/25",
    },
    navy: {
      iconWrap: "bg-sky-50 text-brand-navy",
      glow: "from-sky-400/20",
    },
    amber: {
      iconWrap: "bg-amber-50 text-amber-600",
      glow: "from-amber-400/25",
    },
  }[tone];

  return (
    <article className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b to-transparent",
          tones.glow,
        )}
      />
      <div className="relative flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {Icon ? (
          <span
            className={cn(
              "flex size-9 items-center justify-center rounded-xl",
              tones.iconWrap,
            )}
          >
            <Icon className="size-4" />
          </span>
        ) : null}
      </div>
      <div className="relative mt-5 text-2xl font-semibold tracking-tight text-brand-navy">
        {value}
      </div>
      {hint ? (
        <p className="relative mt-1 text-sm text-muted-foreground">{hint}</p>
      ) : null}
    </article>
  );
}

export function AdminStatusBadge({
  published,
  extra,
}: {
  published: boolean;
  extra?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-medium",
        published
          ? "bg-teal-50 text-teal-700"
          : "bg-orange-50 text-brand-orange",
      )}
    >
      {published ? "Published" : "Draft"}
      {extra ? ` · ${extra}` : ""}
    </span>
  );
}

export function AdminSearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative max-w-sm">
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-brand-teal" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="border-border/80 bg-white pl-8 focus-visible:border-brand-teal"
      />
    </div>
  );
}

export function AdminSectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-brand-navy">{title}</h2>
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
