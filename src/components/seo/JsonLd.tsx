type JsonLdProps = {
  data: Record<string, unknown>;
  /** Distinguishes multiple graphs on one page in devtools. */
  id?: string;
};

/**
 * Serialises structured data into a `<script type="application/ld+json">`.
 *
 * `<` is escaped so a title or description containing `</script>` cannot break
 * out of the tag — the standard hardening for inline JSON payloads.
 */
export function JsonLd({ data, id }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      {...(id ? { id } : {})}
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
