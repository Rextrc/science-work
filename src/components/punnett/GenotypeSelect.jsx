const OPTIONS = [
  { key: 'homDominant', label: (a) => `${a}${a} (homozygous dominant)`, value: (a) => `${a}${a}` },
  { key: 'het', label: (a) => `${a}${a.toLowerCase()} (heterozygous)`, value: (a) => `${a}${a.toLowerCase()}` },
  { key: 'homRecessive', label: (a) => `${a.toLowerCase()}${a.toLowerCase()} (homozygous recessive)`, value: (a) => `${a.toLowerCase()}${a.toLowerCase()}` },
]

export default function GenotypeSelect({ label, allele, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.key} value={opt.value(allele)}>
            {opt.label(allele)}
          </option>
        ))}
      </select>
    </div>
  )
}
