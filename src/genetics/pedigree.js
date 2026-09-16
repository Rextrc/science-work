// Genotype inference for the pedigree chart, reusing the exact same
// monohybrid cross engine as the Punnett Square feature (crossGenotypes).
//
// Rule (deliberately simple, one hop only): if BOTH of an individual's
// parents have a certain genotype (entered directly, or themselves
// resolved with certainty), cross those two genotypes with the Feature 1
// Punnett logic. If all 4 resulting boxes are the same genotype, the
// child's genotype is certain. If they differ but share a phenotype, the
// child's phenotype is certain and they're flagged a possible carrier.
// Otherwise (a parent is missing, or itself uncertain, or the cross gives
// mixed phenotypes) the individual is simply "unknown" - the app does not
// chain guesses through multiple uncertain generations.
//
// Genotypes are stored per individual in a trait-neutral canonical form
// ('AA' | 'Aa' | 'aa'); the real allele letters (genetics/traits.js) are
// only substituted in for display.
import { crossGenotypes, isDominantPhenotype } from './core'

export function resolveGenotypeCategories(individuals) {
  const byId = new Map(individuals.map((ind) => [ind.id, ind]))
  const memo = new Map()

  function resolve(id) {
    if (memo.has(id)) return memo.get(id)
    const ind = byId.get(id)
    let result

    if (ind?.genotype) {
      result = { known: true, certain: true, genotype: ind.genotype }
    } else {
      const parentIds = (ind?.parentIds ?? []).filter((pid) => byId.has(pid))
      const parents = parentIds.length === 2 ? parentIds.map(resolve) : null

      if (parents && parents[0].certain && parents[1].certain) {
        const grid = crossGenotypes(parents[0].genotype, parents[1].genotype)
        const distinctGenotypes = [...new Set(grid.flat())]

        if (distinctGenotypes.length === 1) {
          result = { known: true, certain: true, genotype: distinctGenotypes[0] }
        } else {
          const phenotypes = new Set(distinctGenotypes.map(isDominantPhenotype))
          if (phenotypes.size === 1) {
            result = {
              known: true,
              certain: false,
              dominant: phenotypes.has(true),
              possibleGenotypes: distinctGenotypes,
            }
          } else {
            result = { known: false }
          }
        }
      } else {
        result = { known: false }
      }
    }

    memo.set(id, result)
    return result
  }

  const result = new Map()
  for (const ind of individuals) result.set(ind.id, resolve(ind.id))
  return result
}

// Turns a resolved genotype record into the display facts the UI needs.
export function describeGenotype(resolved, trait) {
  if (!resolved?.known) {
    return { known: false, genotype: null, phenotype: null, carrier: 'none' }
  }

  if (resolved.certain) {
    const genotype = resolved.genotype
    return {
      known: true,
      certain: true,
      genotype: toLetterGenotype(genotype, trait),
      phenotype: genotype === 'aa' ? trait.recessiveTrait : trait.dominantTrait,
      carrier: genotype === 'Aa' ? 'confirmed' : 'none',
    }
  }

  return {
    known: true,
    certain: false,
    genotype: null,
    phenotype: resolved.dominant ? trait.dominantTrait : trait.recessiveTrait,
    carrier: resolved.possibleGenotypes.includes('Aa') ? 'possible' : 'none',
  }
}

export function toLetterGenotype(category, trait) {
  const { allele } = trait
  if (category === 'AA') return `${allele}${allele}`
  if (category === 'aa') return `${allele.toLowerCase()}${allele.toLowerCase()}`
  return `${allele}${allele.toLowerCase()}`
}
