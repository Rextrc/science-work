import { Fragment } from 'react'

function HeaderBadge({ label }) {
  return (
    <span className="inline-flex min-w-10 items-center justify-center rounded-full bg-slate-700 px-2 py-1 font-mono text-xs font-bold text-white">
      {label}
    </span>
  )
}

// A generalized Punnett-style grid: arbitrary row/column header labels
// (gametes, alleles, etc.) and arbitrary per-cell content, reused by the
// dihybrid, blood type, and sex-linked cross views.
export default function CrossGrid({ rowHeaders, colHeaders, grid, renderCell }) {
  return (
    <div className="inline-block">
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `5rem repeat(${colHeaders.length}, 7rem)` }}>
        <div />
        {colHeaders.map((label, i) => (
          <div key={`col-${i}`} className="flex items-center justify-center rounded-t-lg bg-slate-100 py-3">
            <HeaderBadge label={label} />
          </div>
        ))}

        {rowHeaders.map((rowLabel, r) => (
          <Fragment key={`row-${r}`}>
            <div className="flex items-center justify-center rounded-l-lg bg-slate-100">
              <HeaderBadge label={rowLabel} />
            </div>
            {grid[r].map((cell, c) => {
              const rendered = renderCell(cell)
              return (
                <div
                  key={`cell-${r}-${c}`}
                  className="flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg border-2 border-slate-200 bg-white p-1 text-center shadow-sm transition hover:border-teal-400 hover:bg-teal-50"
                >
                  <span className="font-mono text-sm font-bold text-slate-800">{rendered.label}</span>
                  {rendered.sublabel && <span className="text-[10px] leading-tight text-slate-500">{rendered.sublabel}</span>}
                </div>
              )
            })}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
