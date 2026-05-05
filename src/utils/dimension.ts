import { Dimension } from '@/types/Dimension'
import Range from '@/types/Range'

export const ALL_DIMENSIONS = Object.values(Dimension) as Dimension[]

export const MAX = 15

export const PRIMES = [
  2, 3, 5, 7, 11, 13,
  // 17, 19, 23, 29, 31,
]

export const DIMENSION_FACTOR = {
  [Dimension.D1]:  2,
  [Dimension.D2]:  3 /  2,
  [Dimension.D3]:  5 /  4,
  [Dimension.D4]:  7 /  4,
  [Dimension.D5]: 11 /  4,
  [Dimension.D6]: 13 /  4,
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

export const defaultDimensionRanges: Record<Dimension, Range> = {
  [Dimension.D1]: { start: -3, end: 3 },
  [Dimension.D2]: { start: -3, end: 3 },
  [Dimension.D3]: { start: -2, end: 2 },
  [Dimension.D4]: { start: -1, end: 1 },
  [Dimension.D5]: { start: -1, end: 1 },
  [Dimension.D6]: { start: -1, end: 1 },
}

export const DIMENSION_HARMONONYMS = {
  [Dimension.D1]: { up: [], down: [] },
  [Dimension.D2]: { up: ['chy', 'scy', 'xcy'], down: ['fu', 'schu', 'ju'] },
  [Dimension.D3]: { up: ['ly', 'dry'], down: ['su', 'sru'] },
  [Dimension.D4]: { up: ['my', 'mry'], down: ['pu', 'pru'] },
  [Dimension.D5]: { up: ['xy', 'xry'], down: ['tschu', 'kru'] },
  [Dimension.D6]: { up: ['zy', 'zry'], down: ['gu', 'gru'] },
}
