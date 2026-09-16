import { useState } from 'react'
import { SEX_LINKED_TRAITS } from '../../genetics/traits'
import { crossSexLinked, summarizeSexLinkedCross, describeCell } from '../../genetics/sexLinked'
import CrossGrid from '../shared/CrossGrid'
import RatioBreakdown from '../shared/RatioBreakdown'
import HelpPopup from '../shared/HelpPopup'

export default function SexLinkedView() {
  const [traitId, setTraitId] = useState(SEX_LINKED_TRAITS[0].id)
  const trait = SEX_LINKED_TRAITS.find((t) => t.id === traitId)
  const allele = trait.allele

  const [motherGenotype, setMotherGenotype] = useState(`${allele}${allele.toLowerCase()}`)
  const [fatherAllele, setFatherAllele] = useState(allele)

  function handleTraitChange(id) {
    const next = SEX_LINKED_TRAITS.find((t) => t.id === id)
    setTraitId(id)
    setMotherGenotype(`${next.allele}${next.allele.toLowerCase()}`)
    setFatherAllele(next.allele)
  }

  const grid = crossSexLinked(motherGenotype, fatherAllele)
  const summary = summarizeSexLinkedCross(grid, trait)

  const motherOptions = [
    { value: `${allele}${allele}`, label: `X${allele}X${allele} — ${trait.dominantTrait}` },
    { value: `${allele}${allele.toLowerCase()}`, label: `X${allele}X${allele.toLowerCase()} — ${trait.dominantTrait} (carrier)` },
    { value: `${allele.toLowerCase()}${allele.toLowerCase()}`, label: `X${allele.toLowerCase()}X${allele.toLowerCase()} — ${trait.recessiveTrait}` },
  ]
  const fatherOptions = [
    { value: allele, label: `X${allele}Y — ${trait.dominantTrait}` },
    { value: allele.toLowerCase(), label: `X${allele.toLowerCase()}Y — ${trait.recessiveTrait}` },
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <HelpPopup id="sexlinked" title="How to use this">
        Pick the mum's and dad's genotypes. Since boys only inherit one X chromosome (plus a Y), they can never be a
        "carrier" like girls can — they're always either affected or unaffected.
      </HelpPopup>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Sex-Linked Inheritance</h1>
        <p className="mt-1 text-slate-600">
          The gene sits on the X chromosome, so males (XY) only carry one allele — no carrier state is possible for them.
        </p>
      </div>

      <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Condition</label>
          <select
            value={traitId}
            onChange={(e) => handleTraitChange(e.target.value)}
            className="w-72 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
          >
            {SEX_LINKED_TRAITS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Mother's genotype</label>
            <select
              value={motherGenotype}
              onChange={(e) => setMotherGenotype(e.target.value)}
              className="w-72 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
            >
              {motherOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Father's genotype</label>
            <select
              value={fatherAllele}
              onChange={(e) => setFatherAllele(e.target.value)}
              className="w-56 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
            >
              {fatherOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex justify-center overflow-x-auto">
          <CrossGrid
            rowHeaders={motherGenotype.split('').map((a) => `X${a}`)}
            colHeaders={[`X${fatherAllele}`, 'Y']}
            grid={grid}
            renderCell={(cell) => {
              const info = describeCell(cell, trait)
              return { label: info.genotype, sublabel: `${info.sex}, ${info.phenotype}` }
            }}
          />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <RatioBreakdown title="Genotype Ratio" entries={summary.genotypes} total={summary.total} />
          <RatioBreakdown title="Phenotype Ratio" entries={summary.phenotypes} total={summary.total} />
        </div>
      </div>
    </div>
  )
}
