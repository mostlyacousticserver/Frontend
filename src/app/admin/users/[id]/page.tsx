"use client";

import { use } from "react";
import { UserDetail } from "@/components/admin/UserDetail";

export default function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <UserDetail userId={id} />;
}
