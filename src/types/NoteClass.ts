import { findClosest } from '@/utils/math'
import { getOvertones } from '@/utils/overtones'

import { R_360, R_90 } from '@/types/constants'
import JIConstraint from '@/types/JIConstraint'

type NoteClassConstructorOptions = {
  type: 'pitch' | 'factor' | 'angle'
  value: number
}

export default class NoteClass {
  /** in Hertz, the frequency of the note, equals to baseFrequency * Math.pow(2, pitch) */
  factorClass: number

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

    this.factorClass = Math.pow(2, pitch)
    this.pitchClass = pitch
    this.angle = pitch * R_360 - R_90
  }

  public quantizeToJI(constraint: JIConstraint): {
    noteClass: NoteClass
    factorization: number[]
    color: string
    error: number
  } {
    const closest = findClosest(
      getOvertones(constraint),
      c => {
        const abs = Math.abs(c.noteClass.pitchClass - this.pitchClass) % 1
        return abs > 0.5 ? 1 - abs : abs
      },
    )
    return {
      ...closest,
      error: this.pitchClass - closest.noteClass.pitchClass,
    }
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
