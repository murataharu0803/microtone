import React, { useContext } from 'react'

import ChordPresetsContext from '@/context/ChordPresetsContext'
import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

import { ChordPreset } from '@/components/chords/ChordPreset'

import { useChordPresets } from '@/hooks/useChordPresets'
import { useKey } from '@/hooks/useKey'

import Position from '@/types/Position'

interface ChordPresetsProps {
  topLeft: Position
  width: number
  triggerKeys?: string[]
}

export const ChordPresets: React.FC<ChordPresetsProps> = ({
  topLeft,
  width,
  triggerKeys = [],
}) => {
  const { chordPresetManager } = useContext(PitchVisualizeSystemContext)

  const {
    presets,
    activeIndex: activePresetIndex,
  } = useChordPresets()

  const ctx = {
    topLeft,
    boxRadius: 8,
    boxWidth: width,
    boxHeight: 100,
    gap: 16,
  }

  useKey('Escape', () => {
    if (activePresetIndex !== null) chordPresetManager?.setActivePresetIndex(null)
  })

  return <ChordPresetsContext.Provider value={ctx}><g>
    {presets && presets.map((preset, i) => (
      <ChordPreset
        key={i}
        index={i}
        active={i === activePresetIndex}
        notes={preset}
        triggerKey={triggerKeys[i]}
      />
    ))}
  </g></ChordPresetsContext.Provider>

}
