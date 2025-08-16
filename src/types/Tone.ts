const ATTACK = 0.001 // Attack time in seconds
const RELEASE = 0.2 // Release time in seconds
const TRANSITION = 0.05 // Transition time in seconds

export default class Tone {
  public frequency: number | null = null

  private ctx: AudioContext
  private osc: OscillatorNode
  private gain: GainNode
  public isActive: boolean = false
  public dimensions: number[] | null = null

  constructor(ctx: AudioContext) {
    this.ctx = ctx
    this.osc = this.ctx.createOscillator()
    this.gain = this.ctx.createGain()
    this.osc.connect(this.gain)
    this.gain.connect(this.ctx.destination)
    this.gain.gain.setValueAtTime(0, this.ctx.currentTime)
    this.osc.start()
  }

  public play(frequency: number, dimensions?: number[]) {
    if (frequency <= 0) return

    this.osc.type = 'triangle'
    this.osc.frequency.setValueAtTime(frequency, this.ctx.currentTime)
    this.frequency = frequency

    this.gain.gain.setValueAtTime(0, this.ctx.currentTime)
    this.gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + ATTACK)

    this.isActive = true
    this.dimensions = dimensions || null
  }

  public change(frequency: number, dimensions?: number[]) {
    if (frequency <= 0) return

    this.osc.frequency.linearRampToValueAtTime(frequency, this.ctx.currentTime + TRANSITION)
    this.frequency = frequency
    this.dimensions = dimensions || null
  }

  public stop(
    fromPedal: boolean = false,
    isPedaled: boolean = false,
    callback: () => void = () => void 0,
  ) {
    if (fromPedal && this.isActive) return false
    if (!fromPedal) this.isActive = false
    if (!fromPedal && isPedaled) return false

    this.dimensions = null
    this.frequency = null
    this.gain.gain.cancelScheduledValues(this.ctx.currentTime)
    this.gain.gain.setValueAtTime(this.gain.gain.value, this.ctx.currentTime)
    this.gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + RELEASE)
    setTimeout(() => {
      this.cleanup()
      callback()
    }, RELEASE * 1000 + 10)
    return true
  }

  private cleanup() {
    if (this.osc) {
      this.osc.stop()
      this.osc.disconnect()
    }
    if (this.gain) this.gain.disconnect()
  }
}
