import { Suspense } from "react";
import { PurchasesList } from "@/components/admin/PurchasesList";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPurchasesPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <PurchasesList />
    </Suspense>
  );
}
