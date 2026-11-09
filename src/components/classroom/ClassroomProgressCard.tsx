"use client";

import type { ReactNode } from "react";
import { Calendar, CheckCircle2, Circle } from "lucide-react";
import { ProgressRing } from "@/components/classroom/ProgressRing";

type ClassroomProgressCardProps = {
  percent: number;
  completed: number;
  remaining: number;
  estimatedDays?: number | null;
  compact?: boolean;
};

export function ClassroomProgressCard({
  percent,
  completed,
  remaining,
  estimatedDays,
  compact = false,
}: ClassroomProgressCardProps) {
  if (compact) {
    return (
      <div className="rounded-2xl border border-[#E8EEF2] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-4">
          <ProgressRing percent={percent} size={72} strokeWidth={7} label="Complete" />
          <ul className="min-w-0 flex-1 space-y-2">
            <ProgressStat
              icon={<CheckCircle2 size={14} className="text-[#0DA694]" />}
              label={`${completed} Lessons Completed`}
              tone="teal"
            />
            <ProgressStat
              icon={<Circle size={14} className="text-[#9CA3AF]" />}
              label={`${remaining} Lessons Remaining`}
            />
            {estimatedDays != null && estimatedDays > 0 ? (
              <ProgressStat
                icon={<Calendar size={14} className="text-[#0DA694]" />}
                label={`Estimated Finish: ${estimatedDays} Day${estimatedDays === 1 ? "" : "s"}`}
                tone="teal"
              />
            ) : null}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#E8EEF2] bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col items-center text-center">
        <ProgressRing percent={percent} size={148} strokeWidth={12} />
        <p className="mt-4 font-sans text-[15px] font-semibold text-[#111111]">
          Course Progress
        </p>
        <ul className="mt-4 w-full space-y-2.5 text-left">
          <ProgressStat
            icon={<CheckCircle2 size={15} className="text-[#0DA694]" />}
            label={`${completed} Lessons Completed`}
            tone="teal"
          />
          <ProgressStat
            icon={<Circle size={15} className="text-[#9CA3AF]" />}
            label={`${remaining} Lessons Remaining`}
          />
        </ul>
      </div>
    </div>
  );
}

function ProgressStat({
  icon,
  label,
  tone = "muted",
}: {
  icon: ReactNode;
  label: string;
  tone?: "teal" | "muted";
}) {
  return (
    <li className="flex items-center gap-2">
      <span className="shrink-0">{icon}</span>
      <span
        className={`font-sans text-[12px] leading-4 sm:text-[13px] ${
          tone === "teal" ? "font-medium text-[#0DA694]" : "text-[#6B7280]"
        }`}
      >
        {label}
      </span>
    </li>
  );
}
