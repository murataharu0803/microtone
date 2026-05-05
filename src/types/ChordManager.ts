import JINote from '@/types/JINote'

export default class JIChordManager {
  private listeners = new Set<(type: 'pedal' | 'all' | 'single') => void>()
  public notes: JINote[] = []

  public isPedaled: boolean = false

  constructor() {
  }

  public exists(note: JINote) {
    return this.notes.find(n => n.letterNotation === note.letterNotation)
  }

  public play(note: JINote) {
    if (this.exists(note)) return
    this.notes.push(note)
    this.emitChange()
  }

  public stop(n: JINote) {
    const note = this.exists(n)
    if (!note) return
    const success = note.stop(false, this.isPedaled)
    if (!success) return
    this.notes = this.notes.filter(nt => nt.letterNotation !== note.letterNotation)
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
}
