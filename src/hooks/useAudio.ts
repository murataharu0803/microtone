import { useRef } from 'react'

export const useAudio = () => {
  const audioCtxRef = useRef<AudioContext | null>(null)
  const oscRef = useRef<OscillatorNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)

  const ensureContext = () => {
    if (!audioCtxRef.current)
      audioCtxRef.current = new AudioContext()

    return audioCtxRef.current
  }

  const playTone = (frequency: number) => {
    stopTone() // Stop any existing tone
    if (frequency <= 0) return // Invalid frequency

    const ctx = ensureContext()
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)

    oscillator.connect(gain)
    gain.connect(ctx.destination)
    gain.gain.setValueAtTime(0.2, ctx.currentTime) // Volume

    oscillator.start()

    oscRef.current = oscillator
    gainRef.current = gain
  }

  const stopTone = () => {
    oscRef.current?.stop()
    oscRef.current?.disconnect()
    gainRef.current?.disconnect()
    oscRef.current = null
    gainRef.current = null
  }

  const changeTone = (frequency: number) => {
    if (oscRef.current)
      oscRef.current.frequency.setValueAtTime(frequency, audioCtxRef.current!.currentTime)
  }

  return { playTone, stopTone, changeTone }
}
