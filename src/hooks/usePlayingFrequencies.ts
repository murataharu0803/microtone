import React, { useContext, useEffect } from 'react'

import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

export const usePlayingFrequencies = () => {

  const { audioManager } = useContext(PitchVisualizeSystemContext)

  const [frequencies, setFrequencies] = React.useState<number[]>(
    audioManager?.frequencyList || [],
  )

  useEffect(() => {
    const removeSubscription = audioManager?.subscribe(
      () => setFrequencies(audioManager?.frequencyList || []),
    )
    return () => { removeSubscription?.() }
  }, [audioManager])

  return {
    frequencies,
  }
}
