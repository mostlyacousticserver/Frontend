/**
 * Native share sheet with a clipboard fallback.
 *
 * Dismissing the sheet rejects with `AbortError`. That is a normal user
 * action rather than a failure, so it resolves quietly — left unhandled it
 * surfaces as an unhandled rejection, which the dev overlay reports as
 * "Runtime AbortError: Share canceled". Every other `navigator.share` failure
 * (no permission, payload the platform refuses) falls through to copying.
 */
export type ShareOutcome = "shared" | "copied" | "dismissed" | "failed";

export async function copyLink(url: string): Promise<ShareOutcome> {
  // `navigator.clipboard` is undefined outside a secure context, and
  // `writeText` still rejects when the document is not focused.
  try {
    await navigator.clipboard?.writeText(url);
    return "copied";
  } catch {
    return "failed";
  }
}

export async function shareOrCopyLink(data: {
  title: string;
  text?: string;
  url: string;
}): Promise<ShareOutcome> {
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share(data);
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return "dismissed";
      }
      // Anything else means the sheet could not do its job — copy instead.
    }
  }

  return copyLink(data.url);
}
