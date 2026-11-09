"use client";

import { use, useEffect, useState } from "react";
import { BlogAPI } from "@/api/blogs";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlogDetail } from "@/types/blog";

export default function AdminEditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    BlogAPI.getAdmin(id)
      .then((response) => {
        if (!cancelled) setBlog(response.data);
      })
      .catch(() => {
        // interceptor
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (!blog) {
    return <p className="text-sm text-muted-foreground">Blog not found.</p>;
  }

  return <BlogEditor blog={blog} />;
}
