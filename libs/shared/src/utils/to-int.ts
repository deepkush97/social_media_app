export function toInt(v: unknown): number {
  if (typeof v === 'number') return v;
  return (v as { toNumber: () => number }).toNumber();
}
