const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

const DEFAULT_REVALIDATE_SECONDS = 60;

export function publicApiUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Server-side fetch for public catalog APIs. Never throws — network failures
 * during `next build` (API not running) degrade to `{ ok: false }`.
 */
export async function fetchPublicJson<T>(
  path: string,
  revalidateSeconds = DEFAULT_REVALIDATE_SECONDS,
): Promise<{ ok: true; data: T } | { ok: false; status: number }> {
  try {
    const response = await fetch(publicApiUrl(path), {
      next: { revalidate: revalidateSeconds },
    });
    if (!response.ok) {
      return { ok: false, status: response.status };
    }
    return { ok: true, data: (await response.json()) as T };
  } catch {
    return { ok: false, status: 0 };
  }
}
