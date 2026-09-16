function Swatch({ children, label }) {
  return (
    <div className="flex items-center gap-2">
      <svg width={32} height={32} viewBox="0 0 32 32">
        {children}
      </svg>
      <span className="text-sm text-slate-600">{label}</span>
    </div>
  )
}

export default function PedigreeLegend() {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <Swatch label="Male">
        <rect x={6} y={6} width={20} height={20} fill="#fff" stroke="#1e293b" strokeWidth={2} />
      </Swatch>
      <Swatch label="Female">
        <circle cx={16} cy={16} r={10} fill="#fff" stroke="#1e293b" strokeWidth={2} />
      </Swatch>
      <Swatch label="Affected">
        <rect x={6} y={6} width={20} height={20} fill="#334155" stroke="#1e293b" strokeWidth={2} />
      </Swatch>
      <Swatch label="Confirmed carrier">
        <circle cx={16} cy={16} r={10} fill="#fff" stroke="#1e293b" strokeWidth={2} />
        <circle cx={16} cy={16} r={3} fill="#1e293b" />
      </Swatch>
      <Swatch label="Possible carrier">
        <circle cx={16} cy={16} r={10} fill="#fff" stroke="#1e293b" strokeWidth={2} />
        <circle cx={16} cy={16} r={3} fill="none" stroke="#1e293b" strokeWidth={2} />
      </Swatch>
      <Swatch label="Genotype unknown">
        <circle cx={16} cy={16} r={10} fill="#fff" stroke="#1e293b" strokeWidth={2} strokeDasharray="3 2" />
        <text x={16} y={20} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#1e293b">?</text>
      </Swatch>
    </div>
  )
}
