import { useCallback, useContext, useEffect, useState } from 'react'

import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

import { useKey } from '@/hooks/useKey'
import { useMouse } from '@/hooks/useMouse'

type StateTuple = [string | null, React.Dispatch<React.SetStateAction<string | null>>]

export const useNote = (
  frequency: number,
  ref: React.RefObject<Element | null> | null,
  key?: string | null,
) => {
  const { audioManager } = useContext(PitchVisualizeSystemContext)

  const [mouseState, setMouseState] = useState<string | null>(null)
  const [keyState, setKeyState] = useState<string | null>(null)

  const play = useCallback((...[state, setState]: StateTuple) => {
    if (state) setState(audioManager?.play(frequency, state) || null)
    else setState(audioManager?.play(frequency) || null)
  }, [frequency, audioManager])

  const stop = useCallback((...[state, setState]: StateTuple) => {
    if (state) setState(audioManager?.stop(state) || null)
  }, [audioManager])

  const mouseStartPlaying = useCallback(() => play(mouseState, setMouseState), [mouseState, play])
  const mouseStopPlaying = useCallback(() => stop(mouseState, setMouseState), [mouseState, stop])
  const keyStartPlaying = useCallback(() => play(keyState, setKeyState), [keyState, play])
  const keyStopPlaying = useCallback(() => stop(keyState, setKeyState), [keyState, stop])

  useMouse(ref, mouseStartPlaying, mouseStopPlaying)
  useKey(key || '', keyStartPlaying, keyStopPlaying)

  useEffect(() => {
    const removeSubscription = audioManager?.subscribe(
      forceAll => {
        if (forceAll === 'all') {
          setMouseState(null)
          setKeyState(null)
        } else if (forceAll === 'pedal') {
          setMouseState(audioManager?.exists(mouseState) || null)
          setKeyState(audioManager?.exists(keyState) || null)
        }
      },
    )
    return () => { removeSubscription?.(); mouseStopPlaying(); keyStopPlaying() }
  }, [audioManager, keyState, mouseState, keyStopPlaying, mouseStopPlaying])

  return { active: mouseState || keyState }
}
