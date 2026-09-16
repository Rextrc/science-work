import { validateGenotype } from '../../genetics/core'

export default function GenotypeTextInput({ label, value, onChange }) {
  const { valid, error } = value.trim() ? validateGenotype(value) : { valid: true, error: null }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Aa"
        maxLength={2}
        className={`w-28 rounded-lg border px-3 py-2 font-mono text-lg tracking-wide focus:outline-none focus:ring-2 ${
          !valid
            ? 'border-red-400 focus:ring-red-300'
            : 'border-slate-300 focus:ring-teal-300'
        }`}
      />
      {!valid && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
