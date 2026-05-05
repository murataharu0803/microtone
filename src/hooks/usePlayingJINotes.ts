import React, { useContext, useEffect } from 'react'

import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'
import JINote from '@/types/JINote'

export const usePlayingJINotes = () => {

  const { chordManager } = useContext(PitchVisualizeSystemContext)

  const [notes, setNotes] = React.useState<JINote[]>(
    chordManager?.notes || [],
  )

  useEffect(() => {
    const removeSubscription = chordManager?.subscribe(
      () => setNotes(chordManager?.notes || []),
    )
    return () => { removeSubscription?.() }
  }, [chordManager])

  return {
    jiNotes: notes,
  }
}
