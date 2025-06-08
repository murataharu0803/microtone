export default interface Axis {
  start: number
  end: number
  factor: number[]
}

export const defaultAxis = [
  { start: -1, end: 1, factor: [1] },
  { start: -3, end: 3, factor: [-1, 1] },
  { start: -2, end: 2, factor: [-2, 0, 1] },
  { start: -1, end: 1, factor: [-2, 0, 0, 1] },
  { start: -1, end: 1, factor: [-2, 0, 0, 0, 1] },
  { start: -1, end: 1, factor: [-2, 0, 0, 0, 0, 1] },
]
