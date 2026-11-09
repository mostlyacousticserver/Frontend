"use client";

import { useEffect, useState } from "react";
import { LearningAPI } from "@/api/learning";
import { useAuth } from "@/contexts/AuthContext";

export function useCourseAccess(courseId: string | undefined) {
  const { isAuthenticated, isHydrated } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated || !courseId) {
      setHasAccess(false);
      setReady(true);
      return;
    }

    let cancelled = false;
    LearningAPI.getAccess(courseId)
      .then((response) => {
        if (!cancelled) setHasAccess(response.data.hasAccess);
      })
      .catch(() => {
        if (!cancelled) setHasAccess(false);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [courseId, isAuthenticated, isHydrated]);

  return { hasAccess, ready };
}
