/**
 * Normalize raw column text from the database into clean, uniform paragraphs.
 *
 * Handles inconsistencies across notes so every article renders with the same
 * editorial layout, regardless of how the source text was authored.
 *
 * Pipeline:
 *  1. Strip HTML tags (defensive — some entries contain <p>, <br>, etc.)
 *  2. Decode common HTML entities (&nbsp;, &amp;, &mdash;, …)
 *  3. Normalize line endings (\r\n, \r → \n)
 *  4. Convert single line breaks to paragraph breaks (each \n becomes a new paragraph)
 *  5. Collapse 3+ consecutive newlines into a single paragraph break
 *  6. Trim each paragraph and drop empties
 *  7. Collapse internal multi-spaces inside each paragraph
 */
export function normalizeColumnText(raw: string | null | undefined): string[] {
  if (!raw) return [];

  // 1. Strip HTML tags, preserving block-level breaks
  let text = raw
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\/\s*(p|div|h[1-6]|li)\s*>/gi, "\n\n")
    .replace(/<[^>]+>/g, "");

  // 2. Decode common HTML entities
  text = text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&hellip;/gi, "…")
    .replace(/&mdash;/gi, "—")
    .replace(/&ndash;/gi, "–")
    .replace(/&laquo;/gi, "«")
    .replace(/&raquo;/gi, "»")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));

  // 3. Normalize line endings
  text = text.replace(/\r\n?/g, "\n");

  // 4 + 5. Treat any run of one-or-more newlines as a paragraph break.
  //        This guarantees uniform spacing whether the source uses \n or \n\n.
  const paragraphs = text
    .split(/\n+/)
    .map((p) =>
      p
        // collapse any whitespace runs (including non-breaking) into single spaces
        .replace(/[\t\u00A0 ]+/g, " ")
        .trim()
    )
    .filter((p) => p.length > 0);

  return paragraphs;
}
