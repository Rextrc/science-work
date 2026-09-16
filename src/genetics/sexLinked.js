// Sex-linked (X-linked) inheritance. The gene sits on the X chromosome
// only, so a male (XY) has just one allele (hemizygous - always fully
// expressed, no carrier state), while a female (XX) follows the usual
// dominant/recessive rules.
import { normalizeGenotype, isDominantPhenotype } from './core'
import { summarizeCounts, countBy } from './ratio'

// motherGenotype: 2-char string of her X alleles, e.g. 'Nn'.
// fatherAllele: his single X allele, e.g. 'N' or 'n' (he also passes Y).
export function crossSexLinked(motherGenotype, fatherAllele) {
  const motherAlleles = motherGenotype.split('')
  const fatherGametes = [fatherAllele, 'Y']

  return motherAlleles.map((mAllele) =>
    fatherGametes.map((fGamete) =>
      fGamete === 'Y'
        ? { sex: 'male', xAlleles: mAllele }
        : { sex: 'female', xAlleles: normalizeGenotype(mAllele + fGamete) },
    ),
  )
}

export function genotypeLabel(cell) {
  return cell.sex === 'male' ? `X${cell.xAlleles}Y` : `X${cell.xAlleles[0]}X${cell.xAlleles[1]}`
}

export function describeCell(cell, trait) {
  const dominant = isDominantPhenotype(cell.xAlleles)
  const phenotype = dominant ? trait.dominantTrait : trait.recessiveTrait
  const carrier = cell.sex === 'female' && dominant && cell.xAlleles[0] !== cell.xAlleles[1]
  return {
    sex: cell.sex,
    genotype: genotypeLabel(cell),
    phenotype,
    carrier,
  }
}

export function summarizeSexLinkedCross(grid, trait) {
  const cells = grid.flat().map((cell) => describeCell(cell, trait))
  return {
    total: cells.length,
    genotypes: summarizeCounts(countBy(cells, (c) => `${c.genotype} (${c.sex})`)),
    phenotypes: summarizeCounts(countBy(cells, (c) => `${c.sex}, ${c.phenotype}`)),
  }
}
