export default interface JIConstraint {
  maxPrime: number
  maxFactor: number
  maxDivision: number
}

export const defaultJIConstraint: JIConstraint = {
  maxPrime: 13,
  maxFactor: 15,
  maxDivision: 10,
}
