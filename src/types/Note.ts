import JIConstraint from '@/types/JIConstraint'
import NoteClass from '@/types/NoteClass'

type NoteConstructorOptions = {
  baseFrequency: number
  type: 'frequency' | 'pitch' | 'factor'
  value: number
}

export default class Note {
  /** in Hertz, the baseline of the system, considered as C4 (middle C) */
  baseFrequency: number

  /** in Hertz */
  frequency: number

  /** ratio from frequency to baseFrequency. */
  factor: number

  /** in octave units, increases by 1 for each octave. */
  pitch: number

  /** integer, the octave number this pitch is on, equals to Math.floor(pitch) */
  octave: number

  /** the normalized note class */
  class: NoteClass

  constructor({ baseFrequency, value, type }: NoteConstructorOptions) {
    const { frequency, pitch, factor } = {
      frequency: {
        frequency: value,
        pitch: Math.log2(value / baseFrequency),
        factor: value / baseFrequency,
      },
      pitch: {
        frequency: baseFrequency * Math.pow(2, value),
        pitch: value,
        factor: Math.pow(2, value),
      },
      factor: {
        frequency: baseFrequency * value,
        pitch: Math.log2(value),
        factor: value,
      },
    }[type]

    this.baseFrequency = baseFrequency
    this.frequency = frequency
    this.pitch = pitch
    this.factor = factor

    this.class = new NoteClass({ type: 'pitch', value: pitch })
    this.octave = Math.floor(pitch)
  }

  length(startRadius: number, radiusStep: number, startPitch: number): number {
    return startRadius + radiusStep * (this.pitch - startPitch)
  }

  get pitchClass(): number {
    return this.class.pitchClass
  }

  get factorClass(): number {
    return this.class.factorClass
  }

  get angle(): number {
    return this.class.angle
  }

  public quantizeToJI(constraint: JIConstraint): {
    noteClass: NoteClass
    factorization: number[]
    color: string
    error: number
  } {
    return this.class.quantizeToJI(constraint)
  }

  public quantizeToET(ET: number | 'standard' | 'oct'): {
    noteClass: NoteClass
    stepClass: number
    error: number
  } {
    return this.class.quantizeToET(ET)
  }
}
