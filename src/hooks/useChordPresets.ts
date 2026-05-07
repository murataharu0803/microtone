import React, { useContext, useEffect } from 'react'

import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

import JINote from '@/types/JINote'

export const useChordPresets = () => {

  const { chordPresetManager } = useContext(PitchVisualizeSystemContext)

  const [presets, setPresets] = React.useState<JINote[][]>(
    chordPresetManager?.presets || [],
  )
  const [activePresetIndex, setActivePresetIndex] = React.useState<number | null>(
    chordPresetManager?.activePresetIndex ?? null,
  )

  useEffect(() => {
    const removeSubscription = chordPresetManager?.subscribe(
      () => {
        setPresets(chordPresetManager?.presets || [])
        setActivePresetIndex(chordPresetManager?.activePresetIndex ?? null)
      },
    )
    return () => { removeSubscription?.() }
  }, [chordPresetManager])

  return {
    presets,
    activeIndex: activePresetIndex,
  }
}
