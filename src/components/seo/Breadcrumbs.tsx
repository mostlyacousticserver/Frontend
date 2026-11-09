import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Breadcrumb } from "@/lib/json-ld";

type BreadcrumbsProps = {
  items: Breadcrumb[];
  className?: string;
};

/**
 * Visible breadcrumb trail. Search engines use the rendered trail alongside the
 * BreadcrumbList JSON-LD to build SERP breadcrumbs, and it gives every detail
 * page a crawlable link back to its parent listing.
 */
export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  if (items.length < 2) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`font-sans text-[12px] text-[#6B7280] sm:text-[13px] ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.path} className="flex items-center gap-1">
              {index > 0 ? (
                <ChevronRight size={13} className="shrink-0 text-[#C4CAD2]" aria-hidden />
              ) : null}
              {isLast ? (
                <span aria-current="page" className="line-clamp-1 max-w-[46ch] text-[#111111]">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="transition-colors hover:text-[#0DA694]">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
