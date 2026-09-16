import RatioBreakdown from '../shared/RatioBreakdown'

export default function ResultsSummary({ summary, trait }) {
  const genotypeColor = (label) => {
    const het = label[0] !== label[1]
    if (het) return '#10b981' // emerald-500
    const dominant = label.split('').some((a) => a === a.toUpperCase())
    return dominant ? '#0d9488' : '#f59e0b'
  }

  const phenotypeColor = (label) => (label === trait.dominantTrait ? '#0d9488' : '#f59e0b')

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <RatioBreakdown title="Genotype Ratio" entries={summary.genotypes} total={summary.total} colorFor={genotypeColor} />
      <RatioBreakdown title="Phenotype Ratio" entries={summary.phenotypes} total={summary.total} colorFor={phenotypeColor} />
    </div>
  )
}
