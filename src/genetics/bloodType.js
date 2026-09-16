// ABO blood type: the classic IGCSE example of codominance + multiple
// alleles. Three alleles (IA, IB, i); IA and IB are both dominant to i,
// and codominant with each other (both expressed at once => type AB).
import { summarizeCounts, countBy } from './ratio'

const ALLELE_ORDER = { IA: 0, IB: 1, i: 2 }

export const BLOOD_GENOTYPES = [
  { alleles: ['IA', 'IA'], label: 'IAIA', phenotype: 'A' },
  { alleles: ['IA', 'i'], label: 'IAi', phenotype: 'A' },
  { alleles: ['IB', 'IB'], label: 'IBIB', phenotype: 'B' },
  { alleles: ['IB', 'i'], label: 'IBi', phenotype: 'B' },
  { alleles: ['IA', 'IB'], label: 'IAIB', phenotype: 'AB' },
  { alleles: ['i', 'i'], label: 'ii', phenotype: 'O' },
]

export function orderAlleles(alleles) {
  return [...alleles].sort((a, b) => ALLELE_ORDER[a] - ALLELE_ORDER[b])
}

export function alleleLabel(alleles) {
  return orderAlleles(alleles).join('')
}

export function phenotypeForAlleles(alleles) {
  const set = new Set(alleles)
  if (set.has('IA') && set.has('IB')) return 'AB'
  if (set.has('IA')) return 'A'
  if (set.has('IB')) return 'B'
  return 'O'
}

export function crossBloodTypes(alleles1, alleles2) {
  return alleles1.map((a) => alleles2.map((b) => orderAlleles([a, b])))
}

export function summarizeBloodTypeCross(grid) {
  const cells = grid.flat()
  return {
    total: cells.length,
    genotypes: summarizeCounts(countBy(cells, alleleLabel)),
    phenotypes: summarizeCounts(countBy(cells, phenotypeForAlleles)),
  }
}
