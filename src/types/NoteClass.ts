
import { R_360, R_90 } from '@/utils/math'

type NoteClassConstructorOptions = {
  type: 'pitch' | 'factor' | 'angle'
  value: number
}

export default class NoteClass {
  /** in [0, 1), the fractional part of the pitch, equals to pitch - octave */
  pitchClass: number // pitch % 1, in [0, 1)

  /** in radians, the angle of the note in the pitch circle */
  angle: number

  constructor({ type, value }: NoteClassConstructorOptions) {
    let pitch = value
    // normalize first, convert to pitch, it is easier
    if (type === 'pitch') pitch = value - Math.floor(value)
    else if (type === 'factor') pitch = Math.log2(value) - Math.floor(Math.log2(value))
    else if (type === 'angle') {
      pitch = (value + R_90) / R_360
      pitch = pitch - Math.floor(pitch)
    }

    this.pitchClass = pitch
    this.angle = pitch * R_360 - R_90
  }

  public quantizeToET(ET: number | 'standard' | 'oct'): {
    noteClass: NoteClass
    stepClass: number
    error: number
  } {
    const stepPerOctave = typeof ET === 'number' ? ET : ET === 'oct' ? 1 : 12


    const stepClass = this.pitchClass * stepPerOctave
    const closestStepClass = Math.round(stepClass)
    const error = stepClass - closestStepClass

    const noteClass = new NoteClass({ type: 'pitch', value: closestStepClass / stepPerOctave })

    return { noteClass, stepClass: closestStepClass, error }
  }
}
