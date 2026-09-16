// Computes non-overlapping x/y positions for a pedigree chart. Individuals
// are grouped into generation rows; within a row, siblings are clustered
// under their parents' average position and spouses are kept adjacent.
// Positions are assigned to sequential integer slots per row, which
// guarantees no horizontal overlap regardless of family shape.

const COL_WIDTH = 130
const ROW_HEIGHT = 170
const NODE_RADIUS = 26

export function computeLayout(individuals) {
  const byId = new Map(individuals.map((ind) => [ind.id, ind]))
  const byGeneration = new Map()
  for (const ind of individuals) {
    if (!byGeneration.has(ind.generation)) byGeneration.set(ind.generation, [])
    byGeneration.get(ind.generation).push(ind)
  }
  const generations = [...byGeneration.keys()].sort((a, b) => a - b)

  // A "spouse" is anyone who co-parents at least one child in the chart.
  const spouseOf = new Map()
  for (const ind of individuals) {
    if (ind.parentIds?.length === 2) {
      const [a, b] = ind.parentIds
      if (byId.has(a) && byId.has(b)) {
        if (!spouseOf.has(a)) spouseOf.set(a, b)
        if (!spouseOf.has(b)) spouseOf.set(b, a)
      }
    }
  }

  const slotOf = new Map()
  const rows = []

  generations.forEach((generation) => {
    const members = byGeneration.get(generation)
    let blocks

    if (rows.length === 0) {
      blocks = []
      const seen = new Set()
      for (const ind of members) {
        if (seen.has(ind.id)) continue
        const spouseId = spouseOf.get(ind.id)
        const spouseInRow = spouseId && members.some((m) => m.id === spouseId)
        if (spouseInRow && !seen.has(spouseId)) {
          blocks.push([ind.id, spouseId])
          seen.add(ind.id)
          seen.add(spouseId)
        } else {
          blocks.push([ind.id])
          seen.add(ind.id)
        }
      }
    } else {
      const siblingGroups = new Map()
      const marriedInOnly = []
      for (const ind of members) {
        const parentIds = (ind.parentIds ?? []).filter((pid) => byId.has(pid))
        if (parentIds.length > 0) {
          const key = [...parentIds].sort().join('|')
          if (!siblingGroups.has(key)) siblingGroups.set(key, [])
          siblingGroups.get(key).push(ind.id)
        } else {
          marriedInOnly.push(ind.id)
        }
      }

      const anchoredGroups = [...siblingGroups.entries()].map(([key, ids], index) => {
        const parentSlots = key.split('|').map((pid) => slotOf.get(pid)).filter((s) => s !== undefined)
        const anchor = parentSlots.length
          ? parentSlots.reduce((a, b) => a + b, 0) / parentSlots.length
          : index
        return { ids, anchor, index }
      })
      anchoredGroups.sort((a, b) => a.anchor - b.anchor || a.index - b.index)

      const usedMarriedIn = new Set()
      blocks = anchoredGroups.map((group) => {
        const blockIds = []
        for (const id of group.ids) {
          blockIds.push(id)
          const spouseId = spouseOf.get(id)
          if (spouseId && !usedMarriedIn.has(spouseId) && marriedInOnly.includes(spouseId)) {
            blockIds.push(spouseId)
            usedMarriedIn.add(spouseId)
          }
        }
        return blockIds
      })

      for (const id of marriedInOnly) {
        if (!usedMarriedIn.has(id)) blocks.push([id])
      }
    }

    const ids = blocks.flat()
    ids.forEach((id, idx) => slotOf.set(id, idx))
    rows.push({ generation, ids, blocks })
  })

  const maxSlots = Math.max(1, ...rows.map((row) => row.ids.length))
  const totalWidth = maxSlots * COL_WIDTH
  const positions = new Map()

  rows.forEach((row, rowIndex) => {
    const rowWidth = row.ids.length * COL_WIDTH
    const offsetX = (totalWidth - rowWidth) / 2
    row.ids.forEach((id, idx) => {
      positions.set(id, {
        x: offsetX + idx * COL_WIDTH + COL_WIDTH / 2,
        y: rowIndex * ROW_HEIGHT + ROW_HEIGHT / 2,
      })
    })
  })

  // Marriage connectors (dedup by unordered pair).
  const marriages = []
  const seenPairs = new Set()
  for (const [a, b] of spouseOf.entries()) {
    const key = [a, b].sort().join('|')
    if (seenPairs.has(key)) continue
    seenPairs.add(key)
    if (positions.has(a) && positions.has(b)) {
      marriages.push({ a, b, ...linePoints(positions.get(a), positions.get(b)) })
    }
  }

  // Parent -> children connectors, grouped by the exact parent set.
  const familyGroups = new Map()
  for (const ind of individuals) {
    const parentIds = (ind.parentIds ?? []).filter((pid) => byId.has(pid))
    if (parentIds.length === 0) continue
    const key = [...parentIds].sort().join('|')
    if (!familyGroups.has(key)) familyGroups.set(key, { parentIds, children: [] })
    familyGroups.get(key).children.push(ind.id)
  }

  const parentChildGroups = [...familyGroups.values()]
    .map(({ parentIds, children }) => {
      const parentPositions = parentIds.map((pid) => positions.get(pid)).filter(Boolean)
      const childPositions = children.map((cid) => positions.get(cid)).filter(Boolean)
      if (parentPositions.length === 0 || childPositions.length === 0) return null

      const dropX =
        parentPositions.reduce((sum, p) => sum + p.x, 0) / parentPositions.length
      const parentY = parentPositions[0].y
      const childY = childPositions[0].y
      const busY = parentY + (childY - parentY) / 2
      const childXs = childPositions.map((p) => p.x)

      return {
        dropX,
        parentY,
        busY,
        childY,
        busX1: Math.min(dropX, ...childXs),
        busX2: Math.max(dropX, ...childXs),
        children: childPositions,
      }
    })
    .filter(Boolean)

  return {
    positions,
    rows,
    marriages,
    parentChildGroups,
    width: totalWidth,
    height: rows.length * ROW_HEIGHT,
    nodeRadius: NODE_RADIUS,
  }
}

function linePoints(p1, p2) {
  return p1.x <= p2.x ? { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y } : { x1: p2.x, y1: p2.y, x2: p1.x, y2: p1.y }
}
