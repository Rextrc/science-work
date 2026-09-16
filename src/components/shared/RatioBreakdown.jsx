const DEFAULT_PALETTE = ['#0d9488', '#f59e0b', '#0369a1', '#dc2626', '#7c3aed', '#16a34a']

export default function RatioBreakdown({ title, entries, total, colorFor }) {
  const ratioLabel = entries.map((e) => e.ratioPart).join(' : ')
  const getColor = colorFor ?? ((_, i) => DEFAULT_PALETTE[i % DEFAULT_PALETTE.length])

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title} — {ratioLabel}
      </h3>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
        {entries.map((entry, i) => (
          <div
            key={entry.label}
            style={{ width: `${entry.percent}%`, backgroundColor: getColor(entry.label, i) }}
            title={`${entry.label}: ${entry.percent.toFixed(0)}%`}
          />
        ))}
      </div>
      <div className="space-y-2">
        {entries.map((entry) => (
          <div key={entry.label} className="flex items-center justify-between rounded-lg bg-white px-4 py-2 shadow-sm">
            <span className="font-mono text-base font-semibold text-slate-800">{entry.label}</span>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span>{entry.count} / {total}</span>
              <span className="font-medium text-slate-700">{entry.percent.toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
