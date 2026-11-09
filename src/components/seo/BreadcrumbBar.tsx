import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import type { Breadcrumb } from "@/lib/json-ld";

/**
 * Breadcrumb strip that sits directly under the fixed navbar. It owns the
 * navbar offset (previously `pt-[78px]` on each page's first section), so the
 * sections below it now start from a neutral top padding.
 */
export function BreadcrumbBar({ items }: { items: Breadcrumb[] }) {
  return (
    <div className="bg-white pt-[92px]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumbs items={items} />
      </div>
    </div>
  );
}
