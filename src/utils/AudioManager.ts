import Tone from '@/utils/Tone'


export default class AudioManager {
  private ctx: AudioContext
  private tones: Map<string, Tone>
  private listeners = new Set<() => void>()

  constructor() {
    this.ctx = new AudioContext()
    this.tones = new Map<string, Tone>()
  }

  public play(frequency: number, token?: string) {
    if (token) {
      const tone = this.change(frequency, token)
      if (tone) return token
    }

    const tone = new Tone(this.ctx)
    const newToken = Math.random().toString(36).substring(2, 15)
    tone.play(frequency)
    this.tones.set(newToken, tone)
    this.emitChange()
    return newToken
  }

  public change(frequency: number, token: string) {
    const tone = this.tones.get(token)
    if (tone) tone.change(frequency)
    this.emitChange()
    return tone ? token : null
  }

  public stop(token: string) {
    const tone = this.tones.get(token)
    if (tone) tone.stop(() => this.tones.delete(token))
    this.emitChange()
    return tone ? token : null
  }

  public stopAll() {
    this.tones.forEach((tone, token) => {
      tone.stop(() => this.tones.delete(token))
    })
    this.emitChange()
  }

  public get toneList(): string[] {
    return Array.from(this.tones.keys())
  }

  public get frequencyList(): number[] {
    return Array.from(this.tones.values()).map(tone => tone.frequency || 0).filter(Boolean)
  }

  public subscribe(callback: () => void) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  private emitChange() {
    this.listeners.forEach(fn => fn())
  }
}
