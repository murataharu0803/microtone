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
  const { note: closestNote, stepClass, error } = note.quantizeToET(ET)

  if (isOctave)
    return `${note.octave}+${note.pitchClass.toFixed(4).replace('0.', '')}`

  const errorString = error > ERROR_MARGIN ? `+${error.toFixed(3).replace('0.', '.')}` :
    error < -ERROR_MARGIN ? `-${Math.abs(error).toFixed(3).replace('0.', '.')}` : ''

  if (isStandard) {
    const noteIndex = stepClass % 12
    const noteStr = NOTES[noteIndex]
    return `${noteStr}${closestNote.octave + 4}${errorString}`
  }

  const pitchString = closestNote.octave > 0
    ? `${stepClass}${'\''.repeat(closestNote.octave)}`
    : `${stepClass}${','.repeat(-closestNote.octave)}`

  return `${pitchString}${errorString}/${stepPerOctave}ET`
}
