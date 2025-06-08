import Range from '@/types/Range'

export default interface Axis {
  shift: Range
  display: Range
  factor: number[]
}

export const defaultAxis: Axis[] = [
  { shift: { start: -1, end: 3 }, display: { start: 1, end: 1 }, factor: [1] },
  { shift: { start: -2, end: 2 }, display: { start: -3, end: 3 }, factor: [-1, 1] },
  { shift: { start: -2, end: 2 }, display: { start: -2, end: 2 }, factor: [-2, 0, 1] },
  { shift: { start: -1, end: 1 }, display: { start: 0, end: 0 }, factor: [-2, 0, 0, 1] },
  { shift: { start: -1, end: 1 }, display: { start: 0, end: 0 }, factor: [-2, 0, 0, 0, 1] },
  { shift: { start: -1, end: 1 }, display: { start: 0, end: 0 }, factor: [-2, 0, 0, 0, 0, 1] },
]
