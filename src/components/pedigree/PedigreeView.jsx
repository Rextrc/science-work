import { useState } from 'react'
import { TRAITS, CONDITION_TRAIT } from '../../genetics/traits'
import IndividualForm from './IndividualForm'
import PedigreeChart from './PedigreeChart'
import PedigreeLegend from './PedigreeLegend'

const TRAIT_OPTIONS = [CONDITION_TRAIT, ...TRAITS]

export default function PedigreeView() {
  const [traitId, setTraitId] = useState(CONDITION_TRAIT.id)
  const trait = TRAIT_OPTIONS.find((t) => t.id === traitId)
  const [individuals, setIndividuals] = useState([])

  function handleAdd(individual) {
    setIndividuals((prev) => [...prev, individual])
  }

  function handleRemove(id) {
    setIndividuals((prev) =>
      prev
        .filter((ind) => ind.id !== id)
        .map((ind) => ({
          ...ind,
          parentIds: ind.parentIds.filter((pid) => pid !== id),
        })),
    )
  }

  function handleClearAll() {
    setIndividuals([])
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pedigree Chart Builder</h1>
        <p className="mt-1 text-slate-600">
          Add family members generation by generation to build a pedigree, tracking one trait
          or condition at a time.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700">Trait / condition tracked in this pedigree</label>
        <select
          value={traitId}
          onChange={(e) => setTraitId(e.target.value)}
          className="w-72 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
        >
          {TRAIT_OPTIONS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} ({t.dominantTrait} / {t.recessiveTrait})
            </option>
          ))}
        </select>
      </div>

      <PedigreeChart individuals={individuals} trait={trait} />

      <PedigreeLegend />

      <IndividualForm trait={trait} individuals={individuals} onAdd={handleAdd} />

      {individuals.length > 0 && (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Individuals ({individuals.length})
            </h3>
            <button
              onClick={handleClearAll}
              className="text-sm font-medium text-red-600 hover:text-red-700"
            >
              Clear all
            </button>
          </div>
          <ul className="divide-y divide-slate-100">
            {individuals
              .slice()
              .sort((a, b) => a.generation - b.generation)
              .map((ind) => (
                <li key={ind.id} className="flex items-center justify-between py-2 text-sm">
                  <span>
                    <span className="font-medium text-slate-800">{ind.name}</span>{' '}
                    <span className="text-slate-400">
                      · Gen {ind.generation} · {ind.sex}
                      {ind.genotype ? ` · ${ind.genotype}` : ''}
                    </span>
                  </span>
                  <button
                    onClick={() => handleRemove(ind.id)}
                    className="text-slate-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  )
}
