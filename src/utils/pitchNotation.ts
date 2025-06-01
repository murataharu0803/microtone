import { getOvertonePitches, MAX, PRIMES_SYMBOLS_DOWN, PRIMES_SYMBOLS_UP } from '@/utils/prime'

const NOTES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']

const ERROR_MARGIN = 0.000001

export const ETNotation = (
  frequency: number,
  baseFrequency: number,
  ET: number | 'oct' | 'standard',
) => {
  const totalSteps = typeof ET === 'number' ? ET : ET === 'oct' ? 1 : 12
  const isOctave = ET === 'oct'
  const isStandard = ET === 'standard'

  if (isOctave) {
    const ratio = frequency / baseFrequency
    const powerToTwo = Math.log2(ratio)
    const octaveShift = Math.floor(powerToTwo)
    const normalizedPitch = powerToTwo - octaveShift
    return `${octaveShift + 4}+${normalizedPitch.toFixed(4).replace('0.', '')}`
  }

  const ratio = frequency / baseFrequency
  const step = Math.log2(ratio) * totalSteps
  const quantizedStep = Math.round(step)
  const error = step - quantizedStep
  const octaveShift = Math.floor(quantizedStep / totalSteps)
  const normalizedQuantizedStep = quantizedStep - octaveShift * totalSteps

  const errorString =
    error > ERROR_MARGIN
      ? `+${error.toFixed(3).replace('0.', '.')}`
      : error < -ERROR_MARGIN
        ? `-${Math.abs(error).toFixed(3).replace('0.', '.')}`
        : ''

  if (isStandard) {
    const noteIndex = normalizedQuantizedStep % 12
    const note = NOTES[noteIndex]

    return `${note}${octaveShift + 4}${errorString}`
  }

  const pitchString =
    octaveShift > 0
      ? `${normalizedQuantizedStep}${'\''.repeat(octaveShift)}`
      : `${normalizedQuantizedStep}${','.repeat(-octaveShift)}`

  return `${pitchString}${errorString}/${totalSteps}ET`
}

export const JINotation = (
  frequency: number,
  baseFrequency: number,
  maxPrime: number = MAX,
  maxFactor: number = MAX,
  maxDivision: number = MAX,
) => {
  const pitches = getOvertonePitches(
    maxPrime,
    maxFactor,
    maxDivision,
  )

  const factor = frequency / baseFrequency
  const octaveShift = Math.floor(Math.log2(factor))
  const pitch = Math.log2(factor) - octaveShift

  const chooseClose = (num: number) => {
    const abs = Math.abs(num) % 1
    return abs > 0.5 ? 1 - abs : abs
  }
  const closestPitch = pitches.reduce((closest, current) => {
    const closestDiff = chooseClose(closest.pitch - pitch)
    const currentDiff = chooseClose(current.pitch - pitch)
    return currentDiff < closestDiff ? current : closest
  })

  const factorization = closestPitch.factorization
  let text = octaveShift > 0
    ? '>'.repeat(octaveShift)
    : octaveShift < 0
      ? '<'.repeat(-octaveShift) : ''

  for (let i = 0; i < factorization.length; i++) {
    const count = factorization[i]
    if (count === 0) continue
    if (count > 0) text = text + PRIMES_SYMBOLS_UP[i].repeat(count)
    else text = PRIMES_SYMBOLS_DOWN[i].repeat(-count) + text
  }
  if (text === '') text = '.'

  const error = pitch - closestPitch.pitch
  const errorString =
    error > ERROR_MARGIN
      ? `+${error.toFixed(4).replace('0.', '')}`
      : error < -ERROR_MARGIN
        ? `-${Math.abs(error).toFixed(4).replace('0.', '')}`
        : ''

  return text + errorString
}
