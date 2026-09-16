import { useState } from 'react'
import { TRAITS } from '../../genetics/traits'
import { crossDihybrid, summarizeDihybridCross } from '../../genetics/dihybrid'
import GenotypeSelect from './GenotypeSelect'
import CrossGrid from '../shared/CrossGrid'
import RatioBreakdown from '../shared/RatioBreakdown'
import HelpPopup from '../shared/HelpPopup'

const het = (allele) => `${allele}${allele.toLowerCase()}`
const homRec = (allele) => `${allele.toLowerCase()}${allele.toLowerCase()}`

export default function DihybridView() {
  const [traitAId, setTraitAId] = useState(TRAITS[0].id)
  const [traitBId, setTraitBId] = useState(TRAITS[1].id)
  const traitA = TRAITS.find((t) => t.id === traitAId)
  const traitB = TRAITS.find((t) => t.id === traitBId)

  const [p1A, setP1A] = useState(het(traitA.allele))
  const [p1B, setP1B] = useState(het(traitB.allele))
  const [p2A, setP2A] = useState(homRec(traitA.allele))
  const [p2B, setP2B] = useState(homRec(traitB.allele))

  function handleTraitAChange(id) {
    const next = TRAITS.find((t) => t.id === id)
    setTraitAId(id)
    setP1A(het(next.allele))
    setP2A(homRec(next.allele))
  }
  function handleTraitBChange(id) {
    const next = TRAITS.find((t) => t.id === id)
    setTraitBId(id)
    setP1B(het(next.allele))
    setP2B(homRec(next.allele))
  }

  const sameTrait = traitAId === traitBId

  let result = null
  if (!sameTrait) {
    const { grid, gametes1, gametes2 } = crossDihybrid({ traitA: p1A, traitB: p1B }, { traitA: p2A, traitB: p2B })
    const summary = summarizeDihybridCross(grid, traitA, traitB)
    result = { grid, gametes1, gametes2, summary }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <HelpPopup id="dihybrid" title="How to use this">
        Pick two different traits, then choose a genotype for each trait for both parents. The 16-box grid shows
        every combination the children could inherit for both traits at once.
      </HelpPopup>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dihybrid Cross</h1>
        <p className="mt-1 text-slate-600">
          Cross two parents for two independently-assorting traits at once and see the 16-box grid.
        </p>
      </div>

      <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Trait A</label>
            <select
              value={traitAId}
              onChange={(e) => handleTraitAChange(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
            >
              {TRAITS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.dominantTrait} / {t.recessiveTrait})
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Trait B</label>
            <select
              value={traitBId}
              onChange={(e) => handleTraitBChange(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
            >
              {TRAITS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.dominantTrait} / {t.recessiveTrait})
                </option>
              ))}
            </select>
          </div>
        </div>

        {sameTrait && <p className="text-sm text-red-600">Trait A and Trait B must be different traits.</p>}

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-600">Parent 1</h4>
            <div className="flex flex-wrap gap-4">
              <GenotypeSelect label={traitA.name} allele={traitA.allele} value={p1A} onChange={setP1A} />
              <GenotypeSelect label={traitB.name} allele={traitB.allele} value={p1B} onChange={setP1B} />
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-600">Parent 2</h4>
            <div className="flex flex-wrap gap-4">
              <GenotypeSelect label={traitA.name} allele={traitA.allele} value={p2A} onChange={setP2A} />
              <GenotypeSelect label={traitB.name} allele={traitB.allele} value={p2B} onChange={setP2B} />
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="space-y-8">
          <div className="flex justify-center overflow-x-auto">
            <CrossGrid
              rowHeaders={result.gametes1}
              colHeaders={result.gametes2}
              grid={result.grid}
              renderCell={(cell) => ({ label: `${cell.traitA}${cell.traitB}` })}
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <RatioBreakdown title="Genotype Ratio" entries={result.summary.genotypes} total={result.summary.total} />
            <RatioBreakdown title="Phenotype Ratio" entries={result.summary.phenotypes} total={result.summary.total} />
          </div>
        </div>
      )}
    </div>
  )
}
