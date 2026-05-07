import { useCallback, useContext, useEffect, useState } from 'react'

import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

import { useKey } from '@/hooks/useKey'
import { useMouse } from '@/hooks/useMouse'

import JINote from '@/types/JINote'

type StatesTuple = [string[] | null, React.Dispatch<React.SetStateAction<string[] | null>>]

export const useNotes = (
  frequencies: number[],
  ref: React.RefObject<Element | null> | null,
  key?: string | null,
  jiNotes?: JINote[],
  playCallback?: () => void,
  stopCallback?: () => void,
) => {
  const { audioManager, chordManager } = useContext(PitchVisualizeSystemContext)

  const [mouseStates, setMouseStates] = useState<string[] | null>(null)
  const [keyStates, setKeyStates] = useState<string[] | null>(null)

  const play = useCallback((...[states, setStates]: StatesTuple) => {
    if (audioManager)
      setStates(frequencies.map((f, i) => audioManager.play(f, states?.[i])))
    if (chordManager && jiNotes) jiNotes.forEach(jiNote => chordManager.add(jiNote))
    playCallback?.()
  }, [frequencies, audioManager, chordManager, jiNotes, playCallback])

  const stop = useCallback((...[states, setStates]: StatesTuple) => {
    if (!states) return
    if (audioManager) frequencies.forEach((_, i) => { if (states[i]) audioManager.stop(states[i]) })
    setStates(null)
    if (jiNotes) jiNotes.forEach(jiNote => chordManager?.remove(jiNote))
    stopCallback?.()
  }, [audioManager, chordManager, frequencies, jiNotes, stopCallback])

  // eslint-disable-next-line @stylistic/max-len
  const mouseStartPlaying = useCallback(() => play(mouseStates, setMouseStates), [mouseStates, play])
  const mouseStopPlaying = useCallback(() => stop(mouseStates, setMouseStates), [mouseStates, stop])
  const keyStartPlaying = useCallback(() => play(keyStates, setKeyStates), [keyStates, play])
  const keyStopPlaying = useCallback(() => stop(keyStates, setKeyStates), [keyStates, stop])

  useMouse(ref, mouseStartPlaying, mouseStopPlaying)
  useKey(key || '', keyStartPlaying, keyStopPlaying)

  useEffect(() => {
    const removeSubscription = audioManager?.subscribe(
      forceAll => {
        if (forceAll === 'all') {
          setMouseStates(null)
          setKeyStates(null)
        } else if (forceAll === 'pedal' && audioManager) {
          setMouseStates(mouseStates?.map(s => audioManager.exists(s) || '') || null)
          setKeyStates(keyStates?.map(s => audioManager.exists(s) || '') || null)
        }
      },
    )
    return () => { removeSubscription?.(); mouseStopPlaying(); keyStopPlaying() }
  }, [audioManager, keyStates, mouseStates, keyStopPlaying, mouseStopPlaying])

  return { active: mouseStates || keyStates }
}
