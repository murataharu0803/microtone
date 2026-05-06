import { D1, Dimension } from '@/types/Dimension'
import JINote from '@/types/JINote'
import { ALL_DIMENSIONS, DIMENSION_FACTOR } from '@/utils/dimension'

type ChordNode = {
  up: Record<Dimension, ChordNode | null>
  down: Record<Dimension, ChordNode | null>
  parent: ChordNode | null
  note: JINote | null
}

export type Interval = {
  baseFactor: number
  factor: number
  hasNote: boolean
  dimension: Dimension
  direction?: 'up' | 'down'
}

export default class JIChordManager {
  private listeners = new Set<(type: 'pedal' | 'all' | 'single') => void>()
  public notes: JINote[] = []

  public isPedaled: boolean = false

  static createEmptyDimensionRecord = <T>(): Record<Dimension, T | null> =>
    ALL_DIMENSIONS.reduce(
      (acc, dim) => ({ ...acc, [dim]: null }),
      {} as Record<Dimension, T | null>,
    )

  private chordTree: ChordNode = {
    up: JIChordManager.createEmptyDimensionRecord<ChordNode>(),
    down: JIChordManager.createEmptyDimensionRecord<ChordNode>(),
    parent: null,
    note: null,
  }

  constructor() {
  }

  public exists(note: JINote) {
    return this.notes.find(n => n.letterNotation === note.letterNotation)
  }

  public add(note: JINote) {
    if (this.exists(note)) return
    this.notes.push(note)
    this.addToChordTree(note)
    this.emitChange()
  }

  public remove(n: JINote) {
    const note = this.exists(n)
    if (!note) return
    const success = note.stop(false, this.isPedaled)
    if (!success) return
    this.notes = this.notes.filter(nt => nt.letterNotation !== note.letterNotation)
    this.removeFromChordTree(note)
    this.emitChange()
  }

  public stopAll() {
    this.notes = []
    this.emitChange('all')
  }

  public togglePedalOn() {
    this.isPedaled = true
  }

  public togglePedalOff() {
    this.isPedaled = false
    this.notes.forEach(n => n.stop(true, false))
    this.emitChange('pedal')
  }

  public subscribe(callback: (type: 'pedal' | 'all' | 'single') => void) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  private emitChange(type: 'pedal' | 'all' | 'single' = 'single') {
    this.listeners.forEach(fn => fn(type))
  }

  private addToChordTree(note: JINote) {
    let currentNode = this.chordTree
    for (const dimension of ALL_DIMENSIONS) {
      const value = note.dimensions[dimension]
      const direction = value > 0 ? 'up' : 'down'
      for (let i = 0; i < Math.abs(value); i++) {
        if (!currentNode[direction][dimension]) {
          currentNode[direction][dimension] = {
            up: JIChordManager.createEmptyDimensionRecord<ChordNode>(),
            down: JIChordManager.createEmptyDimensionRecord<ChordNode>(),
            parent: currentNode,
            note: null,
          }
        }
        currentNode = currentNode[direction][dimension]
      }
    }
    currentNode.note = note
  }

  private removeFromChordTree(note: JINote) {
    let currentNode = this.chordTree
    const path: { node: ChordNode, dimension: Dimension, direction: 'up' | 'down' }[] = []
    for (const dimension of ALL_DIMENSIONS) {
      const value = note.dimensions[dimension]
      const direction = value > 0 ? 'up' : 'down'
      for (let i = 0; i < Math.abs(value); i++) {
        if (!currentNode[direction][dimension]) return
        currentNode = currentNode[direction][dimension] as ChordNode
        path.push({ node: currentNode, dimension, direction })
      }
    }
    currentNode.note = null

    while (currentNode) {
      if (
        Object.values(currentNode.up).some(n => n) ||
        Object.values(currentNode.down).some(n => n)
      ) break
      if (currentNode.note) break
      const parentNode = currentNode.parent
      if (!parentNode) break
      const { dimension, direction } = path.pop()!
      parentNode[direction][dimension] = null
      currentNode = parentNode
    }
  }

  public listAllIntervals() {
    const intervals: Interval[] = [
      {
        baseFactor: 1,
        factor: 1,
        hasNote: !!this.chordTree.note,
        dimension: D1,
        direction: 'up',
      },
    ]

    // DFS to list all intervals in the chord tree
    const stack: { node: ChordNode, factor: number }[] = [{ node: this.chordTree, factor: 1 }]
    while (stack.length > 0) {
      const { node, factor } = stack.pop()!
      for (const dimension of ALL_DIMENSIONS) {
        for (const direction of ['up', 'down'] as ('up' | 'down')[]) {
          const childNode = node[direction][dimension]
          if (childNode) {
            const dimensionFactor = Math.pow(
              DIMENSION_FACTOR[dimension],
              direction === 'up' ? 1 : -1,
            )
            const newFactor = factor * dimensionFactor
            intervals.push({
              baseFactor: factor,
              factor: newFactor,
              hasNote: !!childNode.note,
              dimension,
              direction,
            })
            stack.push({ node: childNode, factor: newFactor })
          }
        }
      }
    }
    return intervals
  }
}
