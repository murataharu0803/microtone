import Tone from '@/types/Tone'

export default class AudioManager {
  private ctx: AudioContext
  private tones: Map<string, Tone>
  private listeners = new Set<(type: 'pedal' | 'all' | 'single') => void>()

  public isPedaled: boolean = false

  public get toneList(): string[] {
    return Array.from(this.tones.keys())
  }

  public get frequencyList(): number[] {
    return Array.from(this.tones.values())
      .map(tone => tone.frequency || 0).filter(Boolean)
  }

  public get dimensionsList(): number[][] {
    return Array.from(this.tones.values())
      .map(tone => tone.dimensions).filter(Boolean) as number[][]
  }

  constructor() {
    this.ctx = new AudioContext()
    this.tones = new Map<string, Tone>()
  }

  public exists(token: string | null): string | null {
    if (!token) return null
    const tone = this.tones.get(token)
    return tone?.isActive ? token : null
  }

  public play(frequency: number, token?: string, dimensions?: number[]) {
    if (token) {
      const tone = this.change(frequency, token, dimensions)
      if (tone) return token
    }

    const tone = new Tone(this.ctx)
    const newToken = Math.random().toString(36).substring(2, 15)
    tone.play(frequency, dimensions)
    this.tones.set(newToken, tone)
    this.emitChange()
    return newToken
  }

  public change(frequency: number, token: string, dimensions?: number[]) {
    const tone = this.tones.get(token)
    if (!tone) return null
    tone.change(frequency, dimensions)
    this.emitChange()
    return token
  }

  public stop(token: string) {
    const tone = this.tones.get(token)
    if (!tone) return null
    const success = tone.stop(false, this.isPedaled, () => this.tones.delete(token))
    this.emitChange()
    return success ? null : token
  }

  public stopAll() {
    this.tones.forEach(tone => { tone.stop(false, false) })
    this.tones.clear()
    this.emitChange('all')
  }

  public togglePedalOn() {
    this.isPedaled = true
  }

  public togglePedalOff() {
    this.isPedaled = false
    this.tones.forEach(tone => tone.stop(true, false))
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
