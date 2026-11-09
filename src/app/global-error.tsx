"use client";

/**
 * Last-resort boundary for failures in the root layout itself. It must render
 * its own <html>/<body> because the layout never mounted.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          background: "#ffffff",
          color: "#111111",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <h1 style={{ fontSize: 28, margin: 0, letterSpacing: "-0.02em" }}>
            Something went wrong
          </h1>
          <p style={{ marginTop: 12, color: "#6B7280", lineHeight: 1.7 }}>
            We hit an unexpected error while loading the site.
            {error.digest ? ` Reference: ${error.digest}` : ""}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 24,
              height: 44,
              padding: "0 28px",
              borderRadius: 999,
              border: "none",
              background: "#11C5BB",
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
