function RatioBar({ entries, colorFor }) {
  return (
    <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
      {entries.map((entry) => (
        <div
          key={entry.label}
          style={{ width: `${entry.percent}%` }}
          className={colorFor(entry.label)}
          title={`${entry.label}: ${entry.percent.toFixed(0)}%`}
        />
      ))}
    </div>
  )
}

function ResultRow({ entry, total }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white px-4 py-2 shadow-sm">
      <span className="font-mono text-base font-semibold text-slate-800">{entry.label}</span>
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <span>{entry.count} / {total}</span>
        <span className="font-medium text-slate-700">{entry.percent.toFixed(0)}%</span>
      </div>
    </div>
  )
}

export default function ResultsSummary({ summary, trait }) {
  const genotypeRatioLabel = summary.genotypes.map((e) => e.ratioPart).join(' : ')
  const phenotypeRatioLabel = summary.phenotypes.map((e) => e.ratioPart).join(' : ')

  const genotypeColor = (label) => {
    const dominant = label.split('').some((a) => a === a.toUpperCase())
    const het = label[0] !== label[1]
    if (het) return 'bg-emerald-400'
    return dominant ? 'bg-teal-600' : 'bg-amber-400'
  }

  const phenotypeColor = (label) =>
    label === trait.dominantTrait ? 'bg-teal-600' : 'bg-amber-400'

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Genotype Ratio — {genotypeRatioLabel}
        </h3>
        <RatioBar entries={summary.genotypes} colorFor={genotypeColor} />
        <div className="space-y-2">
          {summary.genotypes.map((entry) => (
            <ResultRow key={entry.label} entry={entry} total={summary.total} />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Phenotype Ratio — {phenotypeRatioLabel}
        </h3>
        <RatioBar entries={summary.phenotypes} colorFor={phenotypeColor} />
        <div className="space-y-2">
          {summary.phenotypes.map((entry) => (
            <ResultRow key={entry.label} entry={entry} total={summary.total} />
          ))}
        </div>
      </div>
    </div>
  )
}
