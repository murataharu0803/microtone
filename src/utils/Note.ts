import { findClosest } from '@/utils/math'
import { getOvertones } from '@/utils/prime'

const R_360 = 2 * Math.PI // 360 degrees in radians
const R_90 = Math.PI / 2 // 90 degrees in radians

export interface JIConstraint {
  maxPrime: number
  maxFactor: number
  maxDivision: number
}

export const defaultJIConstraint: JIConstraint = {
  maxPrime: 13,
  maxFactor: 15,
  maxDivision: 10,
}

type NoteClassConstructorOptions = {
  type: 'pitch' | 'factor' | 'angle'
  value: number
}

export class NoteClass {
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
