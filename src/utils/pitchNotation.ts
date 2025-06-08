import { PRIMES_SYMBOLS_DOWN, PRIMES_SYMBOLS_UP } from '@/utils/overtones'

import JIConstraint from '@/types/JIConstraint'
import Note from '@/types/Note'

const NOTES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
export const ERROR_MARGIN = 0.000001

export const ETNotation = (
  frequency: number,
  baseFrequency: number,
  ET: number | 'oct' | 'standard',
) => {
  const stepPerOctave = typeof ET === 'number' ? ET : ET === 'oct' ? 1 : 12
  const isOctave = ET === 'oct'
  const isStandard = ET === 'standard'

  const note = new Note({
    baseFrequency,
    type: 'frequency',
    value: frequency,
  })
  const { stepClass, error } = note.quantizeToET(ET)

  if (isOctave) return `${note.octave + 4}+${note.pitchClass.toFixed(4).replace('0.', '')}`

  const errorString = error > ERROR_MARGIN ? `+${error.toFixed(3).replace('0.', '.')}` :
    error < -ERROR_MARGIN ? `-${Math.abs(error).toFixed(3).replace('0.', '.')}` : ''

  if (isStandard) {
    const noteIndex = stepClass % 12
    const noteStr = NOTES[noteIndex]
    return `${noteStr}${note.octave + 4}${errorString}`
  }

  const pitchString = note.octave > 0
    ? `${stepClass}${'\''.repeat(note.octave)}`
    : `${stepClass}${','.repeat(-note.octave)}`

  return `${pitchString}${errorString}/${stepPerOctave}ET`
}

export const JINotation = (
  frequency: number,
  baseFrequency: number,
  constraint: JIConstraint,
) => {
  const note = new Note({ baseFrequency, type: 'factor', value: frequency / baseFrequency })
  const { factorization, error } = note.quantizeToJI(constraint)

  let text = note.octave > 0 ? '>'.repeat(note.octave) :
    note.octave < 0 ? '<'.repeat(-note.octave) : ''
  for (let i = 0; i < factorization.length; i++) {
    const count = factorization[i]
    if (count === 0) continue
    if (count > 0) text = text + PRIMES_SYMBOLS_UP[i].repeat(count)
    else text = PRIMES_SYMBOLS_DOWN[i].repeat(-count) + text
  }
  if (text === '') text = '.'

  const errorString = error > ERROR_MARGIN ? `+${error.toFixed(4).replace('0.', '')}` :
    error < -ERROR_MARGIN ? `-${Math.abs(error).toFixed(4).replace('0.', '')}` : ''

  return text + errorString
}
