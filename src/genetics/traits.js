// Shared trait/allele definitions used by both the Punnett Square and
// Pedigree Chart features, so letter conventions stay consistent app-wide.

export const TRAITS = [
  {
    id: 'seedShape',
    name: 'Seed Shape',
    allele: 'R',
    dominantTrait: 'Round',
    recessiveTrait: 'Wrinkled',
  },
  {
    id: 'seedColor',
    name: 'Seed Color',
    allele: 'Y',
    dominantTrait: 'Yellow',
    recessiveTrait: 'Green',
  },
  {
    id: 'flowerColor',
    name: 'Flower Color',
    allele: 'P',
    dominantTrait: 'Purple',
    recessiveTrait: 'White',
  },
  {
    id: 'podShape',
    name: 'Pod Shape',
    allele: 'V',
    dominantTrait: 'Inflated',
    recessiveTrait: 'Constricted',
  },
]

// Classic IGCSE X-linked recessive conditions.
export const SEX_LINKED_TRAITS = [
  {
    id: 'colorBlindness',
    name: 'Red-Green Colour Blindness',
    allele: 'N',
    dominantTrait: 'Normal vision',
    recessiveTrait: 'Colour blind',
  },
  {
    id: 'haemophilia',
    name: 'Haemophilia',
    allele: 'H',
    dominantTrait: 'Normal clotting',
    recessiveTrait: 'Haemophilia',
  },
]

export const CONDITION_TRAIT = {
  id: 'condition',
  name: 'Condition',
  allele: 'C',
  dominantTrait: 'Unaffected',
  recessiveTrait: 'Affected',
}

export function getTraitById(id) {
  return TRAITS.find((t) => t.id === id) ?? CONDITION_TRAIT
}
