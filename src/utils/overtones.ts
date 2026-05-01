import JIConstraint from '@/types/JIConstraint'

import NoteClass from '@/types/NoteClass'

export enum Dimension {
  D1 = 'D1',
  D2 = 'D2',
  D3 = 'D3',
  D4 = 'D4',
  D5 = 'D5',
  D6 = 'D6',
}

export const ALL_DIMENSIONS = Object.values(Dimension) as Dimension[]

export const MAX = 15

export const PRIMES = [
  2, 3, 5, 7, 11, 13,
  // 17, 19, 23, 29, 31,
]

export const DIMENSION_FREQ_RATIO = {
  [Dimension.D1]:  2,
  [Dimension.D2]:  3 /  2,
  [Dimension.D3]:  5 /  4,
  [Dimension.D4]:  7 /  4,
  [Dimension.D5]: 11 /  8,
  [Dimension.D6]: 13 /  8,
} as Record<Dimension, number>

export const DIMENSION_COMPLEXITY = {
  [Dimension.D1]:  0,
  [Dimension.D2]:  1,
  [Dimension.D3]:  2,
  [Dimension.D4]:  2,
  [Dimension.D5]:  3,
  [Dimension.D6]:  3,
} as Record<Dimension, number>

export const DIMENSION_COLORS = {
  [Dimension.D1]: '#FFFFFF',
  [Dimension.D2]: '#f4788d',
  [Dimension.D3]: '#76cc89',
  [Dimension.D4]: '#b094e6',
  [Dimension.D5]: '#ffc248',
  [Dimension.D6]: '#50cbde',
} as Record<Dimension, string>

export const DIMENSION_SYMBOLS = {
  [Dimension.D1]: 'I',
  [Dimension.D2]: 'V',
  [Dimension.D3]: 'T',
  [Dimension.D4]: 'S',
  [Dimension.D5]: 'J',
  [Dimension.D6]: 'K',
} as Record<Dimension, string>

export const getOvertones = (constraint: JIConstraint, octaveRange: [number, number]) => {
  const { maxDimension, maxComplexity } = constraint
  const allDimensions = ALL_DIMENSIONS.slice(0, maxDimension)

  const lowestOctave = octaveRange[0]
  const highestOctave = octaveRange[1]

  const dimensionRanges = allDimensions.reduce((ranges, dimension) => {
    if (dimension === Dimension.D1) {
      ranges[dimension] = [lowestOctave, highestOctave]
      return ranges
    }
    const complexity = DIMENSION_COMPLEXITY[dimension]
    const maxRange = Math.floor(maxComplexity / complexity)
    ranges[dimension] = [-maxRange, maxRange]
    return ranges
  }, {} as Record<Dimension, [number, number]>)

  const allDimensionCombinations = allDimensions.reduce((combinations, dimension) => {
    const [min, max] = dimensionRanges[dimension]
    const arr = Array.from({ length: max - min + 1 }, (_, i) => i + min)
    const newCombinations = arr.flatMap(v => combinations.map(c => ({ ...c, [dimension]: v })))
    return newCombinations
  }, [{}] as Record<Dimension, number>[])

  const filteredCombinations = allDimensionCombinations.filter(c => {
    const factor = Object.entries(c).reduce((acc, [dimension, value]) => {
      const dim = dimension as Dimension
      return acc + Math.log2(DIMENSION_FREQ_RATIO[dim]) * value
    }, 0)
    const complexity = Object.entries(c).reduce((acc, [dimension, value]) => {
      const dim = dimension as Dimension
      return acc + Math.abs(value) * DIMENSION_COMPLEXITY[dim]
    }, 0)
    return factor <= octaveRange[1] && factor >= octaveRange[0] && complexity <= maxComplexity
  })

  const overTones = filteredCombinations.map(c => {
    let noteSymbol = '.'
    allDimensions.forEach(dimension => {
      const value = c[dimension]
      if (value > 0)
        noteSymbol += DIMENSION_SYMBOLS[dimension].repeat(value)
      else if (value < 0)
        noteSymbol = DIMENSION_SYMBOLS[dimension].repeat(-value) + noteSymbol
    })

    const pitch = Object.entries(c).reduce((acc, [dimension, value]) => {
      const dim = dimension as Dimension
      return acc + Math.log2(DIMENSION_FREQ_RATIO[dim]) * value
    }, 0)
    const noteClass = new NoteClass({ type: 'pitch', value: pitch })

    const complexity = Object.entries(c).reduce((acc, [dimension, value]) => {
      const dim = dimension as Dimension
      return acc + Math.abs(value) * DIMENSION_COMPLEXITY[dim]
    }, 0)

    const color = allDimensions.reduce((acc, dimension) => {
      const value = c[dimension]
      if (value)
        return DIMENSION_COLORS[dimension]
      return acc
    }, '#888888')

    return {
      noteSymbol,
      noteClass,
      pitch,
      complexity,
      color,
    }
  })

  const sortedOvertones = overTones.sort((a, b) => a.pitch - b.pitch)
  return sortedOvertones
}
