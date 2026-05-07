import JINote from '@/types/JINote'

export default class ChordPresetManager {
  readonly SLOTS = 12
  readonly MAX_NOTES_PER_PRESET = 8

  public presets: (JINote[])[] = Array.from({ length: this.SLOTS }, () => [])

  public activePresetIndex: number | null = null

  private listeners = new Set<() => void>()

  public setActivePresetIndex = (index: number | null) => {
    if (index !== null && (index < 0 || index >= this.SLOTS)) return
    this.activePresetIndex = index
    this.emitChange()
  }

  public addNoteToPreset = (note: JINote) => {
    if (this.activePresetIndex === null) return
    if (this.activePresetIndex < 0 || this.activePresetIndex >= this.SLOTS) return
    const preset = this.presets[this.activePresetIndex]
    if (preset.find(n => n.letterNotation === note.letterNotation)) return
    if (preset.length >= this.MAX_NOTES_PER_PRESET) return
    const next = [...this.presets]
    next[this.activePresetIndex] = [...preset, note]
    this.presets = next
    this.emitChange()
  }

  public removeNoteFromPreset = (note: JINote) => {
    if (this.activePresetIndex === null) return
    if (this.activePresetIndex < 0 || this.activePresetIndex >= this.SLOTS) return
    const preset = this.presets[this.activePresetIndex]
    const next = [...this.presets]
    next[this.activePresetIndex] = preset.filter(n => n.letterNotation !== note.letterNotation)
    this.presets = next
    this.emitChange()
  }

  public subscribe(callback: () => void) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  private emitChange() {
    this.listeners.forEach(fn => fn())
  }
}
