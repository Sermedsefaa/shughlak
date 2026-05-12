/** Normalize phone / WhatsApp field to digits only for wa.me links */
export function toWhatsAppDigits(input: string | null | undefined): string | null {
  if (!input) return null;
  const digits = input.replace(/\D/g, "");
  return digits.length ? digits : null;
}
