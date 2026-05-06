import { D1, Dimension } from '@/types/Dimension'
import Note from '@/types/Note'
import {
  ALL_DIMENSIONS,
  DIMENSION_COLORS,
  DIMENSION_FACTOR,
  DIMENSION_HARMONONYMS,
  DIMENSION_SYMBOLS,
} from '@/utils/dimension'

export default class JINote extends Note {
  public dimensions: Record<Dimension, number> = {} as Record<Dimension, number>

  public harmononym: string
  public letterNotation: string

  public isActive: boolean = false
  public isPedaled: boolean = false

  public color: string = '#888888'

  static getFactorFromDimensions = (dimensions: Record<Dimension, number>) => {
    const factor = ALL_DIMENSIONS.map(dim => {
      return Math.pow(DIMENSION_FACTOR[dim], dimensions[dim])
    }).reduce((acc, cur) => cur * acc, 1)
    return factor
  }

  static getLetterNotationFromDimensions = (dimensions: Record<Dimension, number>) => {
    let notation = '.'
    ALL_DIMENSIONS.forEach(dim => {
      const dn = dimensions[dim]
      const sym = DIMENSION_SYMBOLS[dim]
      if (dn > 0) notation = notation + sym.repeat(Math.abs(dn))
      if (dn < 0) notation = sym.repeat(Math.abs(dn)) + notation
    })
    return notation
  }

  static getHarmononymFromDimensions = (dimensions: Record<Dimension, number>) => {
    try {
      const names: string[] = []
      ALL_DIMENSIONS.slice(1).forEach(dim => {
        const dn = dimensions[dim]
        const syms = DIMENSION_HARMONONYMS[dim]
        let sym = null
        if (dn > 0) sym = syms.up[dn - 1]
        if (dn < 0) sym = syms.down[- dn - 1]
        if (dn && !sym) throw new Error('No such note name')
        if (sym) names.push(sym)
      })
      if (names.length) {
        let harmononym = names.join('')
        const lastChar = harmononym.charAt(harmononym.length - 1)
        if (names.length > 1 && lastChar === 'y') harmononym = harmononym.slice(0, -1) + 'i'
        if (names.length > 1 && lastChar === 'u') harmononym = harmononym.slice(0, -1)
        if (names.length > 1 && harmononym.endsWith('tsch')) harmononym.replace(/tsch$/, 'k')
        harmononym = harmononym.charAt(0).toUpperCase() + harmononym.slice(1)
        return harmononym
      } else return 'Ah'
    } catch {
      return ''
    }
  }

  static getColorFromDimensions = (dimensions: Record<Dimension, number>) => {
    const factor = ALL_DIMENSIONS
      .reduce((acc, cur) => dimensions[cur] ? DIMENSION_COLORS[cur] : acc, DIMENSION_COLORS[D1])
    return factor
  }

  constructor(dimensions: Record<Dimension, number>, baseFrequency: number) {
    const computedFactor = JINote.getFactorFromDimensions(dimensions)
    super({ baseFrequency, value: computedFactor, type: 'factor' })
    this.letterNotation = JINote.getLetterNotationFromDimensions(dimensions)
    this.harmononym = JINote.getHarmononymFromDimensions(dimensions)
    this.color = JINote.getColorFromDimensions(dimensions)
    Object.assign(this.dimensions, dimensions)
  }

  public play() {
    this.isActive = true
  }

  public stop(
    fromPedal: boolean = false,
    isPedaled: boolean = false,
  ) {
    if (fromPedal && this.isActive) return false
    if (!fromPedal) this.isActive = false
    if (!fromPedal && isPedaled) return false
    return true
  }
}
