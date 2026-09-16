// Shared helper for turning a list of (label, count) pairs into a
// simplified ratio + percentage breakdown. Used by every cross feature
// (monohybrid, dihybrid, blood type, sex-linked) so ratios are computed
// and displayed consistently across the app.

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b)
}

function gcdAll(values) {
  return values.reduce((acc, v) => gcd(acc, v), values[0] ?? 1)
}

// counts: Map<label, count>
export function summarizeCounts(counts) {
  const total = [...counts.values()].reduce((a, b) => a + b, 0)
  const divisor = gcdAll([...counts.values()])
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({
      label,
      count,
      ratioPart: count / divisor,
      percent: (count / total) * 100,
    }))
}

export function countBy(items, keyFn) {
  const counts = new Map()
  for (const item of items) {
    const key = keyFn(item)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return counts
}
