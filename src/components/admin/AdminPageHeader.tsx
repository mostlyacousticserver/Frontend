import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AdminPageHeader({
  eyebrow = "Admin",
  title,
  description,
  actions,
  variant = "light",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  variant?: "light" | "onDark";
}) {
  const onDark = variant === "onDark";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1.5">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-brand-teal uppercase">
          {eyebrow}
        </p>
        <h1
          className={cn(
            "text-2xl font-semibold tracking-tight md:text-3xl",
            onDark ? "text-white" : "text-brand-navy",
          )}
        >
          {title}
        </h1>
        {description ? (
          <p
            className={cn(
              "max-w-2xl text-sm leading-6",
              onDark ? "text-white/70" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
