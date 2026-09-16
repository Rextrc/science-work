// Vocabulary deck for the inheritance unit. Definitions start blank on
// purpose: the student fills them in (in their own words, from their
// textbook) via the flashcard editor, and they're saved to this browser's
// localStorage so they persist across visits.
export const DEFAULT_TERMS = [
  'Chromosome',
  'Gene',
  'Allele',
  'Genotype',
  'Phenotype',
  'Homozygous',
  'Heterozygous',
  'Dominant',
  'Recessive',
  'Codominance',
  'Haploid',
  'Diploid',
  'Gamete',
  'Zygote',
  'Carrier',
  'Sex-linked',
  'Autosome',
  'Mutation',
].map((term, i) => ({ id: `term-${i}`, term, definition: '' }))

const STORAGE_KEY = 'inheritance-vocab-v1'

export function loadTerms() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_TERMS
  } catch {
    return DEFAULT_TERMS
  }
}

export function saveTerms(terms) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(terms))
  } catch {
    // localStorage unavailable (private browsing, etc.) - not fatal.
  }
}
