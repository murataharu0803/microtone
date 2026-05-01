export default interface JIConstraint {
  maxDimension: number
  maxComplexity: number
}

export const defaultJIConstraint: JIConstraint = {
  maxDimension: 6,
  maxComplexity: 4,
}
