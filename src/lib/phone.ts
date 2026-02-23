export function normalizeEthiopianPhone(phone: string): string {
  const trimmed = (phone || "").trim();
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return "";

  if (digits.startsWith("251")) {
    const rest = digits.slice(3);
    return rest ? `0${rest}` : "";
  }

  if (digits.startsWith("9") && digits.length === 9) {
    return `0${digits}`;
  }

  if (digits.startsWith("0")) {
    return digits;
  }

  return digits;
}

