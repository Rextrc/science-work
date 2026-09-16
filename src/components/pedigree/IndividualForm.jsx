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
  parent1: '',
  parent2: '',
  spouse: '',
  genotype: '',
}

// Generation is never typed in by hand - it's worked out from whoever
// you picked as parents (one more than the older of the two) or, if
// this person married into the family, from their spouse's generation.
function computeGeneration(parentIds, spouseId, individuals) {
  const byId = new Map(individuals.map((ind) => [ind.id, ind]))
  const parentGens = parentIds.map((id) => byId.get(id)?.generation).filter((g) => g !== undefined)
  if (parentGens.length > 0) return Math.max(...parentGens) + 1
  const spouse = spouseId ? byId.get(spouseId) : null
  if (spouse) return spouse.generation
  return 1
}

function PersonOptions({ individuals }) {
  return [...individuals]
    .sort((a, b) => a.generation - b.generation || a.name.localeCompare(b.name))
    .map((p) => (
      <option key={p.id} value={p.id}>
        {p.name}
      </option>
    ))
}

export default function IndividualForm({ trait, individuals, onAdd }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState(null)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const name = form.name.trim()
    if (!name) {
      setError('Name is required.')
      return
    }
    if (form.parent1 && form.parent2 && form.parent1 === form.parent2) {
      setError('Parent 1 and Parent 2 must be different people.')
      return
    }
    if (form.spouse && (form.spouse === form.parent1 || form.spouse === form.parent2)) {
      setError('Someone can\'t be both a parent and a spouse.')
      return
    }

    const parentIds = [form.parent1, form.parent2].filter(Boolean)
    const generation = computeGeneration(parentIds, form.spouse || null, individuals)

    onAdd({
      id: crypto.randomUUID(),
      name,
      sex: form.sex,
      generation,
      parentIds,
      spouseId: form.spouse || null,
      genotype: form.genotype || null,
    })

    setForm(emptyForm)
    setError(null)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-6">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Add a family member</h3>

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
      </div>

      {individuals.length > 0 && (
        <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">
            Is this person related to anyone already added? Pick their parent(s), or their spouse if they married
            into the family. Leave both blank if they're a new, unrelated person (e.g. the oldest generation).
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="ind-parent1" className="text-sm font-medium text-slate-700">Parent 1 (optional)</label>
              <select
                id="ind-parent1"
                value={form.parent1}
                onChange={(e) => update('parent1', e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
              >
                <option value="">None</option>
                <PersonOptions individuals={individuals} />
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
                <PersonOptions individuals={individuals} />
              </select>
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2">
              <label htmlFor="ind-spouse" className="text-sm font-medium text-slate-700">
                Spouse (optional — pick if they married into the family)
              </label>
              <select
                id="ind-spouse"
                value={form.spouse}
                onChange={(e) => update('spouse', e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
              >
                <option value="">None</option>
                <PersonOptions individuals={individuals} />
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="ind-genotype" className="text-sm font-medium text-slate-700">Genotype ({trait.name})</label>
        <select
          id="ind-genotype"
          value={form.genotype}
          onChange={(e) => update('genotype', e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300 sm:w-auto"
        >
          {GENOTYPE_OPTIONS(trait).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
      >
        Add family member
      </button>
    </form>
  )
}
