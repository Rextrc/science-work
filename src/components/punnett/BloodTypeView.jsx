import { useState } from 'react'
import { BLOOD_GENOTYPES, crossBloodTypes, summarizeBloodTypeCross, alleleLabel, phenotypeForAlleles } from '../../genetics/bloodType'
import CrossGrid from '../shared/CrossGrid'
import RatioBreakdown from '../shared/RatioBreakdown'

const PHENOTYPE_COLORS = { A: '#0d9488', B: '#0369a1', AB: '#7c3aed', O: '#f59e0b' }

function GenotypeSelect({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-56 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
      >
        {BLOOD_GENOTYPES.map((g) => (
          <option key={g.label} value={g.label}>
            {g.label} — Type {g.phenotype}
          </option>
        ))}
      </select>
    </div>
  )
}

export default function BloodTypeView() {
  const [g1, setG1] = useState('IAi')
  const [g2, setG2] = useState('IBi')

  const alleles1 = BLOOD_GENOTYPES.find((g) => g.label === g1).alleles
  const alleles2 = BLOOD_GENOTYPES.find((g) => g.label === g2).alleles

  const grid = crossBloodTypes(alleles1, alleles2)
  const summary = summarizeBloodTypeCross(grid)

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Codominance &amp; Multiple Alleles</h1>
        <p className="mt-1 text-slate-600">
          ABO blood type: I<sup>A</sup> and I<sup>B</sup> are both dominant to i, and codominant with each other.
        </p>
      </div>

      <div className="flex flex-wrap gap-6 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <GenotypeSelect label="Parent 1 genotype" value={g1} onChange={setG1} />
        <GenotypeSelect label="Parent 2 genotype" value={g2} onChange={setG2} />
      </div>

      <div className="space-y-8">
        <div className="flex justify-center overflow-x-auto">
          <CrossGrid
            rowHeaders={alleles1}
            colHeaders={alleles2}
            grid={grid}
            renderCell={(cell) => ({ label: alleleLabel(cell), sublabel: `Type ${phenotypeForAlleles(cell)}` })}
          />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <RatioBreakdown title="Genotype Ratio" entries={summary.genotypes} total={summary.total} />
          <RatioBreakdown
            title="Phenotype Ratio (Blood Type)"
            entries={summary.phenotypes}
            total={summary.total}
            colorFor={(label) => PHENOTYPE_COLORS[label] ?? '#64748b'}
          />
        </div>
      </div>
    </div>
  )
}
