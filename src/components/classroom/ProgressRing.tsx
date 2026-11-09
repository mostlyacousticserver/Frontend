"use client";

type ProgressRingProps = {
  percent: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
};

export function ProgressRing({
  percent,
  size = 120,
  strokeWidth = 10,
  label,
  className = "",
}: ProgressRingProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(percent)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${clamped}% complete`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#11C5BB"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-sans text-[22px] font-bold leading-none text-[#111111] sm:text-[26px]">
          {clamped}%
        </span>
        {label ? (
          <span className="mt-1 font-sans text-[10px] font-medium tracking-wide text-[#6B7280] uppercase">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
