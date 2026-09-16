import { Fragment } from 'react'

function AlleleBadge({ allele }) {
  const dominant = allele === allele.toUpperCase()
  return (
    <span
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full font-mono text-sm font-bold ${
        dominant ? 'bg-teal-600 text-white' : 'bg-amber-400 text-amber-950'
      }`}
    >
      {allele}
    </span>
  )
}

export default function PunnettGrid({ genotype1, genotype2, grid }) {
  const cols = genotype2.split('')
  const rows = genotype1.split('')

  return (
    <div className="inline-block">
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `4rem repeat(${cols.length}, 6rem)` }}
      >
        {/* top-left corner */}
        <div />
        {/* parent 2 header row */}
        {cols.map((allele, i) => (
          <div
            key={`col-${i}`}
            className="flex items-center justify-center rounded-t-lg bg-slate-100 py-3"
          >
            <AlleleBadge allele={allele} />
          </div>
        ))}

        {rows.map((rowAllele, r) => (
          <Fragment key={`row-${r}`}>
            <div className="flex items-center justify-center rounded-l-lg bg-slate-100">
              <AlleleBadge allele={rowAllele} />
            </div>
            {grid[r].map((offspringGenotype, c) => (
              <div
                key={`cell-${r}-${c}`}
                className="flex aspect-square items-center justify-center rounded-lg border-2 border-slate-200 bg-white text-2xl font-mono font-bold text-slate-800 shadow-sm transition hover:border-teal-400 hover:bg-teal-50"
              >
                {offspringGenotype}
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
