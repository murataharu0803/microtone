import { JIConstraint, NoteClass } from '@/utils/Note'

export const MAX = 31

export const PRIMES = [
  2, 3, 5, 7, 11, 13,
  17, 19, 23, 29, 31,
]

export const PRIMES_SYMBOLS_UP = [
  '', 'V', 'T', 'S', 'L', 'J',
  'H', 'N', 'X', 'Y', 'Z',
]

export const PRIMES_SYMBOLS_DOWN = [
  '', 'v', 't', 's', 'l', 'j',
  'h', 'n', 'x', 'y', 'z',
]


export const OVERTONES_FACTORS = [
  2, 3, 5, 7,
  9, 11, 13, 15,
  17, 19, 21, 23, 25, 27, 29, 31,
]

export const OVERTONES_COLORS = [
  '#FFFFFF', '#f4788d', '#76cc89', '#b094e6',
  '#ffc248', '#50cbde', '#FF0000', '#00FF00',
  '#0000FF', '#00FFFF', '#FF00FF', '#FFFF00',
  '#FF8000', '#8000FF', '#0080FF', '#808000',
]

export const OVERTONES_FACTORIZATIONS = OVERTONES_FACTORS.map(
  n => {
    if (n > MAX)
      throw new Error(`Number ${n} exceeds maximum prime factorization limit of ${MAX}`)
    if (n % 1 !== 0) throw new Error(`Number ${n} is not an integer, cannot factorize`)

    // Initialize an empty array for factors
    const factors = Array.from({ length: PRIMES.length }, () => 0)

    let curNumber = n
    while (curNumber > 1) {
      for (const [i, prime] of PRIMES.entries()) {
        if (curNumber % prime === 0) {
          factors[i]++
          curNumber /= prime
          break // Restart from the first prime after division
        }
      }
    }

    return factors
  },
)

const OVERTONES = OVERTONES_FACTORS
  .map((factor, overtoneIndex) => {
    const normalizedFactor = (() => {
      let cur = factor
      while (cur >= 2) cur /= 2
      return cur
    })()
    const pitch = Math.log2(factor) % 1
    return {
      originalFactor: factor,
      factorization: OVERTONES_FACTORIZATIONS[overtoneIndex],
      factor: normalizedFactor,
      pitch,
    }
  })

export const getOvertones = (constraint: JIConstraint) => {
  const { maxPrime, maxFactor, maxDivision } = constraint

  if (maxPrime > MAX || maxFactor > MAX || maxDivision > MAX)
    throw new Error(`Maximum values cannot exceed ${MAX}`)
  if (maxPrime < 2 || maxFactor < 2)
    throw new Error('Maximum prime or factor must be at least 1')
  if (maxDivision < 1) throw new Error('Maximum division must be at least 1')

  const primesCount = PRIMES.filter(prime => prime <= maxPrime).length
  const filteredOvertones = OVERTONES
    .filter(overtone => overtone.factorization.slice(primesCount).every(count => count === 0))
  const overtones = filteredOvertones.filter(overtone => overtone.originalFactor <= maxFactor)
  const divisions = filteredOvertones.filter(overtone => overtone.originalFactor <= maxDivision)

  const factors: {
    noteClass: NoteClass
    factorization: number[]
    color: string
  }[] = [{
    noteClass: new NoteClass({ type: 'factor', value: 1 }),
    factorization: Array(primesCount).fill(0),
    color: OVERTONES_COLORS[0],
  }]
  for (const overtone of overtones) {
    for (const division of divisions) {
      if (overtone.factorization.some((count, index) => count && division.factorization[index]))
        continue // Skip if both overtone and division share any prime factor

      const factor = overtone.factor / division.factor
      const noteClass = new NoteClass({ type: 'factor', value: factor })

      const factorization = overtone.factorization.map(
        (count, index) => count - division.factorization[index],
      )
      const maxPrimeIndex = factorization.length - 1 - [...factorization].reverse()
        .findIndex((count, index) => count && OVERTONES_COLORS[index])
      const color = OVERTONES_COLORS[maxPrimeIndex] || '#888888'

      factors.push({
        factorization,
        noteClass,
        color,
      })
    }
  }

  return factors.sort((a, b) => a.noteClass.pitchClass - b.noteClass.pitchClass)
}
