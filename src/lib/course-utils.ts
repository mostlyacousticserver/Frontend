export function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] | null {
  const nextIndex = index + direction;
  if (index < 0 || nextIndex < 0 || nextIndex >= items.length) {
    return null;
  }

  const copy = [...items];
  const current = copy[index];
  const neighbor = copy[nextIndex];
  if (current === undefined || neighbor === undefined) {
    return null;
  }

  copy[index] = neighbor;
  copy[nextIndex] = current;
  return copy;
}

export function formatDuration(seconds: number | null | undefined) {
  if (seconds === null || seconds === undefined || !Number.isFinite(seconds)) {
    return null;
  }

  const total = Math.round(Math.max(seconds, 0));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function parseDurationToSeconds(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (/^\d+$/.test(trimmed)) {
    return Number(trimmed);
  }

  const match = trimmed.match(/^(\d+):([0-5]?\d)$/);
  if (!match) return null;

  return Number(match[1]) * 60 + Number(match[2]);
}

export function formatCoursePrice(
  value: string | number | null | undefined,
  currency = "INR",
) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
}
