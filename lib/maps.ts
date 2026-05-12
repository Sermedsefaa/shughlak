/** Google Maps search (no API key) */
export function mapsSearchUrl(query: string): string {
  const q = encodeURIComponent(query.trim() || "Kirkuk");
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

/** Split gallery field: one URL per line */
export function parseGalleryUrls(raw: string | null | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => /^https?:\/\//i.test(s));
}
