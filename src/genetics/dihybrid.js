// Dihybrid cross logic: two independently-assorting traits at once.
// Builds on the same normalize/phenotype helpers as the monohybrid cross
// (genetics/core.js) rather than duplicating them.
import { normalizeGenotype, phenotypeFor } from './core'
import { summarizeCounts, countBy } from './ratio'

// A parent's gametes: every combination of one allele from trait A with
// one allele from trait B (independent assortment), in fixed FOIL order.
export function computeGametes(genotypeA, genotypeB) {
  const gametes = []
  for (const a of genotypeA) {
    for (const b of genotypeB) {
      gametes.push(a + b)
    }
  }
  return gametes
}

// parent1/parent2: { traitA: 'Rr', traitB: 'Yy' }
export function crossDihybrid(parent1, parent2) {
  const gametes1 = computeGametes(parent1.traitA, parent1.traitB)
  const gametes2 = computeGametes(parent2.traitA, parent2.traitB)

  const grid = gametes1.map((g1) =>
    gametes2.map((g2) => ({
      traitA: normalizeGenotype(g1[0] + g2[0]),
      traitB: normalizeGenotype(g1[1] + g2[1]),
    })),
  )

  return { grid, gametes1, gametes2 }
}

export function genotypeLabel(cell) {
  return `${cell.traitA}${cell.traitB}`
}

export function phenotypeLabel(cell, traitA, traitB) {
  return `${phenotypeFor(cell.traitA, traitA)}, ${phenotypeFor(cell.traitB, traitB)}`
}

export function summarizeDihybridCross(grid, traitA, traitB) {
  const cells = grid.flat()
  return {
    total: cells.length,
    genotypes: summarizeCounts(countBy(cells, genotypeLabel)),
    phenotypes: summarizeCounts(countBy(cells, (c) => phenotypeLabel(c, traitA, traitB))),
  }
}
