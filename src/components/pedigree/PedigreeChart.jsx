import { computeLayout } from '../../genetics/pedigreeLayout'
import { resolveGenotypeCategories, describeGenotype } from '../../genetics/pedigree'

const AFFECTED_FILL = '#334155' // slate-700
const UNAFFECTED_FILL = '#ffffff'
const STROKE = '#1e293b' // slate-800
const LINE_COLOR = '#94a3b8' // slate-400

function IndividualNode({ ind, pos, info, radius }) {
  const { x: cx, y: cy } = pos
  const isSquare = ind.sex === 'male'
  const clipId = `clip-${ind.id}`

  const shapeProps = isSquare
    ? { x: cx - radius, y: cy - radius, width: radius * 2, height: radius * 2 }
    : { cx, cy, r: radius }

  const affected = info.known && info.phenotype && info.phenotype === info.trait.recessiveTrait
  const uncertainPhenotype = info.known && !info.certain && info.phenotype === null
  const unknown = !info.known

  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          {isSquare ? <rect {...shapeProps} /> : <circle {...shapeProps} />}
        </clipPath>
      </defs>

      {isSquare ? (
        <rect
          {...shapeProps}
          fill={affected ? AFFECTED_FILL : UNAFFECTED_FILL}
          stroke={STROKE}
          strokeWidth={2}
          strokeDasharray={unknown ? '4 3' : undefined}
        />
      ) : (
        <circle
          {...shapeProps}
          fill={affected ? AFFECTED_FILL : UNAFFECTED_FILL}
          stroke={STROKE}
          strokeWidth={2}
          strokeDasharray={unknown ? '4 3' : undefined}
        />
      )}

      {uncertainPhenotype && (
        <g clipPath={`url(#${clipId})`}>
          <rect x={cx - radius} y={cy - radius} width={radius} height={radius * 2} fill={AFFECTED_FILL} />
        </g>
      )}

      {info.carrier === 'confirmed' && (
        <circle cx={cx} cy={cy} r={radius * 0.28} fill={STROKE} />
      )}
      {info.carrier === 'possible' && (
        <circle cx={cx} cy={cy} r={radius * 0.28} fill="none" stroke={STROKE} strokeWidth={2} />
      )}
      {unknown && (
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize={16} fill={STROKE} fontWeight="bold">
          ?
        </text>
      )}

      <text x={cx} y={cy + radius + 16} textAnchor="middle" fontSize={12} fontWeight="600" fill="#334155">
        {ind.name}
      </text>
      <text x={cx} y={cy + radius + 30} textAnchor="middle" fontSize={11} fill="#64748b">
        {info.known && info.genotype ? info.genotype : info.known && !info.certain ? '?' : ''}
        {info.phenotype ? ` · ${info.phenotype}` : ''}
      </text>
    </g>
  )
}

export default function PedigreeChart({ individuals, trait }) {
  if (individuals.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 text-slate-400">
        Add individuals below to start building the pedigree.
      </div>
    )
  }

  const layout = computeLayout(individuals)
  const categories = resolveGenotypeCategories(individuals)

  const padding = 40
  const viewWidth = layout.width + padding * 2
  const viewHeight = layout.height + padding * 2

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-4">
      <svg width={viewWidth} height={viewHeight} viewBox={`0 0 ${viewWidth} ${viewHeight}`}>
        <g transform={`translate(${padding}, ${padding})`}>
          {layout.rows.map((row) => (
            <text
              key={row.generation}
              x={-20}
              y={row.ids.length ? layout.positions.get(row.ids[0]).y + 4 : 0}
              fontSize={12}
              fill="#94a3b8"
              textAnchor="end"
            >
              Gen {row.generation}
            </text>
          ))}

          {layout.marriages.map((m, i) => (
            <line key={`m-${i}`} x1={m.x1} y1={m.y1} x2={m.x2} y2={m.y2} stroke={LINE_COLOR} strokeWidth={2} />
          ))}

          {layout.parentChildGroups.map((group, i) => (
            <g key={`f-${i}`}>
              <line
                x1={group.dropX}
                y1={group.parentY}
                x2={group.dropX}
                y2={group.busY}
                stroke={LINE_COLOR}
                strokeWidth={2}
              />
              <line
                x1={group.busX1}
                y1={group.busY}
                x2={group.busX2}
                y2={group.busY}
                stroke={LINE_COLOR}
                strokeWidth={2}
              />
              {group.children.map((child, j) => (
                <line
                  key={j}
                  x1={child.x}
                  y1={group.busY}
                  x2={child.x}
                  y2={child.y}
                  stroke={LINE_COLOR}
                  strokeWidth={2}
                />
              ))}
            </g>
          ))}

          {individuals.map((ind) => {
            const pos = layout.positions.get(ind.id)
            if (!pos) return null
            const info = describeGenotype(categories.get(ind.id), trait)
            return (
              <IndividualNode
                key={ind.id}
                ind={ind}
                pos={pos}
                radius={layout.nodeRadius}
                info={{ ...info, trait }}
              />
            )
          })}
        </g>
      </svg>
    </div>
  )
}
