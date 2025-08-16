import Range from '@/types/Range'

export default interface Axis {
  shift: Range
  display: Range
  factor: number
  factors: number[]
}

export const defaultAxis: Axis[] = [
  { shift: { start: -1, end: 3 }, display: { start: 1, end: 1 },
    factor: 2, factors: [1] },
  { shift: { start: -2, end: 2 }, display: { start: -3, end: 3 },
    factor: 3 / 2, factors: [-1, 1] },
  { shift: { start: -2, end: 2 }, display: { start: -2, end: 2 },
    factor: 5 / 4, factors: [-2, 0, 1] },
  { shift: { start: -1, end: 1 }, display: { start: 0, end: 0 },
    factor: 7 / 4, factors: [-2, 0, 0, 1] },
  { shift: { start: -1, end: 1 }, display: { start: 0, end: 0 },
    factor: 11 / 4, factors: [-2, 0, 0, 0, 1] },
  { shift: { start: -1, end: 1 }, display: { start: 0, end: 0 },
    factor: 13 / 4, factors: [-2, 0, 0, 0, 0, 1] },
]

export const getFactorFromDimensions = (
  dimensions: number[],
  axis: Axis[],
): number => dimensions.reduce((factor, d, i) => {
  if (d === 0) return factor
  const axisFactor = axis[i]?.factor || 1
  return factor * Math.pow(axisFactor, d)
}, 1)
