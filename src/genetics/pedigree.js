// Genotype inference for the pedigree chart. Genotypes are stored in a
// trait-neutral canonical form ('AA' | 'Aa' | 'aa') so switching the
// pedigree's active trait doesn't require re-entering data; the real
// allele letters (from genetics/traits.js) are only substituted in for
// display.

const CANONICAL_CATEGORIES = ['AA', 'Aa', 'aa']

function contributionAlleles(category) {
  if (category === 'AA') return ['A']
  if (category === 'aa') return ['a']
  return ['A', 'a']
}

function combineAllele(a, b) {
  if (a === 'A' && b === 'A') return 'AA'
  if (a === 'a' && b === 'a') return 'aa'
  return 'Aa'
}

function unionContribution(categories) {
  const alleles = new Set()
  for (const category of categories) {
    for (const allele of contributionAlleles(category)) alleles.add(allele)
  }
  return [...alleles]
}

function combineParentAlleles(allelesA, allelesB) {
  const result = new Set()
  for (const a of allelesA) {
    for (const b of allelesB) {
      result.add(combineAllele(a, b))
    }
  }
  return result
}

// Resolves the set of genetically possible genotype categories for every
// individual, propagating known/entered genotypes down through parent ->
// child relationships. Returns a Map<id, Set<'AA'|'Aa'|'aa'> | null>
// (null = no data at all to infer from).
export function resolveGenotypeCategories(individuals) {
  const byId = new Map(individuals.map((ind) => [ind.id, ind]))
  const memo = new Map()
  const visiting = new Set()

  function resolve(id) {
    if (memo.has(id)) return memo.get(id)
    if (visiting.has(id)) return null // cycle guard; shouldn't occur in valid data
    visiting.add(id)

    const ind = byId.get(id)
    let categories = null

    if (ind?.genotype) {
      categories = new Set([ind.genotype])
    } else {
      const parentIds = (ind?.parentIds ?? []).filter((pid) => byId.has(pid))
      if (parentIds.length > 0) {
        const parentAlleleSets = parentIds.map((pid) => {
          const parentCategories = resolve(pid)
          return parentCategories ? unionContribution(parentCategories) : ['A', 'a']
        })
        // A single recorded parent is combined with an unconstrained
        // "unknown" second parent, since we have no data on them.
        if (parentAlleleSets.length === 1) parentAlleleSets.push(['A', 'a'])
        categories = combineParentAlleles(parentAlleleSets[0], parentAlleleSets[1])
      }
    }

    visiting.delete(id)
    memo.set(id, categories)
    return categories
  }

  const result = new Map()
  for (const ind of individuals) result.set(ind.id, resolve(ind.id))
  return result
}

// Turns a resolved category set into the display facts the UI needs:
// exact genotype (if certain), phenotype, and carrier status.
export function describeGenotype(categories, trait) {
  if (!categories || categories.size === 0) {
    return { known: false, genotype: null, phenotype: null, carrier: 'unknown', possibilities: [] }
  }

  const possibilities = CANONICAL_CATEGORIES.filter((c) => categories.has(c))
  const phenotypesPresent = new Set(possibilities.map((g) => (g === 'aa' ? 'recessive' : 'dominant')))
  const carrier = possibilities.includes('Aa')
    ? possibilities.length === 1
      ? 'confirmed'
      : 'possible'
    : 'none'

  if (possibilities.length === 1) {
    const genotype = possibilities[0]
    return {
      known: true,
      certain: true,
      genotype: toLetterGenotype(genotype, trait),
      phenotype: genotype === 'aa' ? trait.recessiveTrait : trait.dominantTrait,
      carrier,
      possibilities,
    }
  }

  const phenotype =
    phenotypesPresent.size === 1
      ? phenotypesPresent.has('recessive')
        ? trait.recessiveTrait
        : trait.dominantTrait
      : null

  return {
    known: true,
    certain: false,
    genotype: null,
    phenotype,
    carrier,
    possibilities,
  }
}

export function toLetterGenotype(category, trait) {
  const { allele } = trait
  if (category === 'AA') return `${allele}${allele}`
  if (category === 'aa') return `${allele.toLowerCase()}${allele.toLowerCase()}`
  return `${allele}${allele.toLowerCase()}`
}
