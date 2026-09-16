import { useState } from 'react'

const GENOTYPE_OPTIONS = (trait) => [
  { value: '', label: 'Unknown / not entered' },
  { value: 'AA', label: `AA — homozygous dominant (${trait.dominantTrait})` },
  { value: 'Aa', label: `Aa — heterozygous carrier (${trait.dominantTrait})` },
  { value: 'aa', label: `aa — homozygous recessive (${trait.recessiveTrait})` },
]

const emptyForm = {
  name: '',
  sex: 'female',
  generation: 1,
  parent1: '',
  parent2: '',
  genotype: '',
}

export default function IndividualForm({ trait, individuals, onAdd }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState(null)

  const generation = Number(form.generation) || 1
  const eligibleParents = individuals.filter((ind) => ind.generation < generation)

  function update(field, value) {
    setForm((f) => {
      const next = { ...f, [field]: value }
      if (field === 'generation') {
        const gen = Number(value) || 1
        const stillEligible = (id) => !id || individuals.some((ind) => ind.id === id && ind.generation < gen)
        if (!stillEligible(next.parent1)) next.parent1 = ''
        if (!stillEligible(next.parent2)) next.parent2 = ''
      }
      return next
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const name = form.name.trim()
    if (!name) {
      setError('Name is required.')
      return
    }
    if (!Number.isInteger(generation) || generation < 1) {
      setError('Generation must be a positive whole number.')
      return
    }
    if (form.parent1 && form.parent2 && form.parent1 === form.parent2) {
      setError('Parent 1 and Parent 2 must be different people.')
      return
    }

    const parentIds = [form.parent1, form.parent2].filter(Boolean)

    onAdd({
      id: crypto.randomUUID(),
      name,
      sex: form.sex,
      generation,
      parentIds,
      genotype: form.genotype || null,
    })

    setForm({ ...emptyForm, generation })
    setError(null)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-6">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Add an individual</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="ind-name" className="text-sm font-medium text-slate-700">Name</label>
          <input
            id="ind-name"
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
            placeholder="e.g. Grandma Rose"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="ind-sex" className="text-sm font-medium text-slate-700">Sex</label>
          <select
            id="ind-sex"
            value={form.sex}
            onChange={(e) => update('sex', e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
          >
            <option value="female">Female (circle)</option>
            <option value="male">Male (square)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="ind-generation" className="text-sm font-medium text-slate-700">Generation</label>
          <input
            id="ind-generation"
            type="number"
            min={1}
            value={form.generation}
            onChange={(e) => update('generation', e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="ind-genotype" className="text-sm font-medium text-slate-700">Genotype ({trait.name})</label>
          <select
            id="ind-genotype"
            value={form.genotype}
            onChange={(e) => update('genotype', e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
          >
            {GENOTYPE_OPTIONS(trait).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="ind-parent1" className="text-sm font-medium text-slate-700">Parent 1 (optional)</label>
          <select
            id="ind-parent1"
            value={form.parent1}
            onChange={(e) => update('parent1', e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
          >
            <option value="">None</option>
            {eligibleParents.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (Gen {p.generation})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="ind-parent2" className="text-sm font-medium text-slate-700">Parent 2 (optional)</label>
          <select
            id="ind-parent2"
            value={form.parent2}
            onChange={(e) => update('parent2', e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
          >
            <option value="">None</option>
            {eligibleParents.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (Gen {p.generation})
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
      >
        Add individual
      </button>
    </form>
  )
}
