// Core genotype/cross logic shared by the Punnett Square and Pedigree
// features. Genotypes are always represented as a 2-character string,
// e.g. "Aa", with uppercase = dominant allele, lowercase = recessive.

import { summarizeCounts, countBy } from './ratio'

const GENOTYPE_PATTERN = /^[A-Za-z]{2}$/

export function validateGenotype(genotype) {
  if (typeof genotype !== 'string') {
    return { valid: false, error: 'Genotype is required.' }
  }
  const trimmed = genotype.trim()
  if (trimmed.length === 0) {
    return { valid: false, error: 'Genotype is required.' }
  }
  if (!GENOTYPE_PATTERN.test(trimmed)) {
    return {
      valid: false,
      error: 'Genotype must be exactly 2 letters (e.g. "Aa", "AA", "aa").',
    }
  }
  const [a, b] = trimmed
  if (a.toLowerCase() !== b.toLowerCase()) {
    return {
      valid: false,
      error: 'Both alleles must use the same letter (e.g. "Aa", not "Ab").',
    }
  }
  return { valid: true, error: null, genotype: normalizeGenotype(trimmed) }
}

// Sorts a genotype so the dominant (uppercase) allele is listed first.
export function normalizeGenotype(genotype) {
  const [a, b] = genotype
  return a === a.toUpperCase() ? a + b : b + a
}

export function isHomozygous(genotype) {
  const [a, b] = genotype
  return a === b
}

export function isHeterozygous(genotype) {
  const [a, b] = genotype
  return a !== b
}

export function isDominantPhenotype(genotype) {
  return genotype.split('').some((allele) => allele === allele.toUpperCase())
}

export function phenotypeFor(genotype, trait) {
  return isDominantPhenotype(genotype) ? trait.dominantTrait : trait.recessiveTrait
}

// Computes all 4 offspring genotype combinations for a monohybrid cross,
// preserving Punnett-square cell order (parent1 allele x parent2 allele).
export function crossGenotypes(genotype1, genotype2) {
  const alleles1 = genotype1.split('')
  const alleles2 = genotype2.split('')
  const grid = []
  for (const a1 of alleles1) {
    const row = []
    for (const a2 of alleles2) {
      row.push(normalizeGenotype(a1 + a2))
    }
    grid.push(row)
  }
  return grid
}

export function summarizeCross(grid, trait) {
  const cells = grid.flat()
  return {
    total: cells.length,
    genotypes: summarizeCounts(countBy(cells, (g) => g)),
    phenotypes: summarizeCounts(countBy(cells, (g) => phenotypeFor(g, trait))),
  }
}
