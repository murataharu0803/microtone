import React, { useContext, useEffect } from 'react'

import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'
import { Interval } from '@/types/ChordManager'
import JINote from '@/types/JINote'

export const usePlayingJINotes = () => {

  const { chordManager } = useContext(PitchVisualizeSystemContext)

  const [notes, setNotes] = React.useState<JINote[]>(
    chordManager?.notes || [],
  )
  const [intervals, setIntervals] = React.useState<Interval[]>([])

  useEffect(() => {
    const removeSubscription = chordManager?.subscribe(
      () => {
        setNotes(chordManager?.notes || [])
        setIntervals(chordManager?.listAllIntervals() || [])
      },
    )
    return () => { removeSubscription?.() }
  }, [chordManager])

  return {
    jiNotes: notes,
    intervals,
  }
}
