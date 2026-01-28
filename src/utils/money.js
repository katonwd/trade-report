export function toNumber(value) {
  if (value === undefined || value === null) return 0;

  const cleaned = String(value)
    .replace(/\$/g, '')
    .replace(/\s/g, '')
    .replace(',', '.');

  const num = Number(cleaned);
  return isNaN(num) ? 0 : num;
}
