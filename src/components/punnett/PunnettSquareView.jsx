import { useState } from 'react'
import { TRAITS } from '../../genetics/traits'
import { crossGenotypes, summarizeCross, validateGenotype } from '../../genetics/core'
import GenotypeSelect from './GenotypeSelect'
import GenotypeTextInput from './GenotypeTextInput'
import PunnettGrid from './PunnettGrid'
import ResultsSummary from './ResultsSummary'
import HelpPopup from '../shared/HelpPopup'

export default function PunnettSquareView() {
  const [mode, setMode] = useState('preset') // 'preset' | 'manual'
  const [traitId, setTraitId] = useState(TRAITS[0].id)
  const trait = TRAITS.find((t) => t.id === traitId)

  const [presetGenotype1, setPresetGenotype1] = useState(`${trait.allele}${trait.allele.toLowerCase()}`)
  const [presetGenotype2, setPresetGenotype2] = useState(`${trait.allele.toLowerCase()}${trait.allele.toLowerCase()}`)

  const [manualGenotype1, setManualGenotype1] = useState('Aa')
  const [manualGenotype2, setManualGenotype2] = useState('aa')
  const [manualTraitName, setManualTraitName] = useState('Trait')

  function handleTraitChange(id) {
    const next = TRAITS.find((t) => t.id === id)
    setTraitId(id)
    setPresetGenotype1(`${next.allele}${next.allele.toLowerCase()}`)
    setPresetGenotype2(`${next.allele.toLowerCase()}${next.allele.toLowerCase()}`)
  }

  const genotype1 = mode === 'preset' ? presetGenotype1 : manualGenotype1
  const genotype2 = mode === 'preset' ? presetGenotype2 : manualGenotype2

  const validation1 = validateGenotype(genotype1)
  const validation2 = validateGenotype(genotype2)
  const bothLettersMatch =
    validation1.valid && validation2.valid
      ? genotype1[0].toLowerCase() === genotype2[0].toLowerCase()
      : true
  const canCompute = validation1.valid && validation2.valid && bothLettersMatch

  const activeTrait = mode === 'preset'
    ? trait
    : {
        name: manualTraitName || 'Trait',
        dominantTrait: `Dominant (${genotype1[0]?.toUpperCase() || 'A'}_)`,
        recessiveTrait: `Recessive (${(genotype1[0] || 'a').toLowerCase()}${(genotype1[0] || 'a').toLowerCase()})`,
      }

  let result = null
  if (canCompute) {
    const grid = crossGenotypes(validation1.genotype, validation2.genotype)
    const summary = summarizeCross(grid, activeTrait)
    result = { grid, summary }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <HelpPopup id="monohybrid" title="How to use this">
        Pick a trait, then choose each parent's genotype from the dropdowns (or type your own under "Enter genotypes
        manually"). The grid fills in automatically with every possible offspring, plus the ratios below it.
      </HelpPopup>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Punnett Square Generator</h1>
        <p className="mt-1 text-slate-600">
          Cross two parent genotypes and see the offspring outcomes for a monohybrid trait.
        </p>
      </div>

      <div className="inline-flex rounded-lg border border-slate-300 bg-slate-100 p-1">
        <button
          onClick={() => setMode('preset')}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
            mode === 'preset' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Pick a trait
        </button>
        <button
          onClick={() => setMode('manual')}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
            mode === 'manual' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Enter genotypes manually
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
        {mode === 'preset' ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Trait</label>
              <select
                value={traitId}
                onChange={(e) => handleTraitChange(e.target.value)}
                className="w-64 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
              >
                {TRAITS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.dominantTrait} / {t.recessiveTrait})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap gap-6">
              <GenotypeSelect
                label="Parent 1 genotype"
                allele={trait.allele}
                value={presetGenotype1}
                onChange={setPresetGenotype1}
              />
              <GenotypeSelect
                label="Parent 2 genotype"
                allele={trait.allele}
                value={presetGenotype2}
                onChange={setPresetGenotype2}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Trait name (optional)</label>
              <input
                type="text"
                value={manualTraitName}
                onChange={(e) => setManualTraitName(e.target.value)}
                placeholder="e.g. Eye Color"
                className="w-64 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>
            <div className="flex flex-wrap gap-6">
              <GenotypeTextInput label="Parent 1 genotype" value={manualGenotype1} onChange={setManualGenotype1} />
              <GenotypeTextInput label="Parent 2 genotype" value={manualGenotype2} onChange={setManualGenotype2} />
            </div>
            {validation1.valid && validation2.valid && !bothLettersMatch && (
              <p className="text-sm text-red-600">
                Both parents must use the same letter for this trait (e.g. "Aa" and "aa", not "Aa" and "Bb").
              </p>
            )}
          </div>
        )}
      </div>

      {result && (
        <div className="space-y-8">
          <div className="flex justify-center">
            <PunnettGrid
              genotype1={validation1.genotype}
              genotype2={validation2.genotype}
              grid={result.grid}
            />
          </div>
          <ResultsSummary summary={result.summary} trait={activeTrait} />
        </div>
      )}
    </div>
  )
}
