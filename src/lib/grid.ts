/**
 * Which project cards run full width in a two-column grid. The first one
 * always does; the last one does too when it would otherwise sit alone in
 * its row, so no row is left half empty.
 */
export function isWide(index: number, total: number): boolean {
  if (index === 0) return true;
  return index === total - 1 && (total - 1) % 2 === 1;
}
