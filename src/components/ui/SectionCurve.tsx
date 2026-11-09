"use client";

import { useEffect, useId, useState } from "react";

type SectionCurveProps = {
  /** Color painted into the curve — usually the background of the section that follows. */
  fillColor?: string;
  /** Extra classes applied to the outer wrapper (e.g. to tweak height). */
  className?: string;
  /** Where to anchor the curve within the section. */
  position?: "top" | "bottom";
};

const VIEW_WIDTH = 1219;
const VIEW_HEIGHT = 240;

/**
 * Decorative curve divider anchored to the bottom edge of a section — a
 * rounded top-left corner (c-top + r-top) that sweeps into a curved
 * transition on the right (top-right), all drawn in one shared coordinate
 * space so the three pieces line up correctly.
 *
 * SVG mask content mounts after hydration to avoid url(#id) SSR mismatches.
 */
export function SectionCurve({
  fillColor = "#ffffff",
  className = "",
  position = "bottom",
}: SectionCurveProps) {
  const uid = useId();
  const maskId = `sc-mask-${uid.replace(/:/g, "")}`;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 h-20 overflow-hidden md:h-28 lg:h-36 ${
        position === "top" ? "top-0 rotate-180" : "bottom-0"
      } ${className}`}
    >
      {mounted ? (
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          preserveAspectRatio="none"
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <mask id={maskId}>
              <rect width={VIEW_WIDTH} height={VIEW_HEIGHT} fill="#fff" />
              <circle className="c-top" cx="120" cy="0" r="120" fill="#000" />
              <rect
                className="r-top"
                width="1099"
                height="120"
                x="120"
                fill="#000"
              />
              <path
                className="top-right"
                d="M 1099 120 L 1219 120 L 1219 240 Q 1219 120 1099 120 Z"
                fill="#000"
              />
            </mask>
          </defs>

          <rect
            width={VIEW_WIDTH}
            height={VIEW_HEIGHT}
            fill={fillColor}
            mask={`url(#${maskId})`}
          />
        </svg>
      ) : null}
    </div>
  );
}
