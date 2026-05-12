/** Build tel: href from stored phone (expects international +964… style). */
export function toTelHref(phone: string | null | undefined): string | null {
  if (!phone?.trim()) return null;
  const compact = phone.replace(/\s/g, "");
  if (compact.startsWith("+") && /^\+[\d]{8,16}$/.test(compact)) {
    return `tel:${compact}`;
  }
  const digits = compact.replace(/\D/g, "");
  if (digits.length < 8) return null;
  return `tel:+${digits}`;
}
