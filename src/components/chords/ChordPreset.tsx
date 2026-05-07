import React, { useContext } from 'react'

import ChordPresetsContext from '@/context/ChordPresetsContext'
import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

import PitchGridDot from '@/components/grid/PitchGridDot'

import { useKey } from '@/hooks/useKey'
import { useNotes } from '@/hooks/useNotes'

import JINote from '@/types/JINote'

interface ChordPresetProps {
  index: number
  active: boolean
  notes: JINote[]
  triggerKey?: string | null
}

export const ChordPreset: React.FC<ChordPresetProps> = ({
  index,
  active,
  notes,
  triggerKey,
}) => {
  const { chordPresetManager } = useContext(PitchVisualizeSystemContext)
  const {
    topLeft,
    boxRadius,
    boxWidth,
    boxHeight,
    gap,
  } = React.useContext(ChordPresetsContext)

  const buttonRef = React.useRef<SVGGElement>(null)

  useKey('Backspace', () => {
    if (active) chordPresetManager?.removeNoteFromPreset(notes[notes.length - 1])
  })

  useNotes(
    notes.map(note => note.frequency),
    buttonRef,
    triggerKey || null,
    notes,
    () => {
      if (!active) chordPresetManager?.setActivePresetIndex(index)
    },
  )

  return <g ref={buttonRef}>
    <rect
      x={topLeft.x}
      y={topLeft.y + index * (boxHeight + gap)}
      width={boxWidth}
      height={boxHeight}
      rx={boxRadius}
      ry={boxRadius}
      stroke={active ? 'white' : 'gray'}
      strokeWidth="2"
    />
    {notes.map((note, i) => <PitchGridDot
      key={i}
      position={{
        x: topLeft.x + 48 * i + 32,
        y: topLeft.y + index * (boxHeight + gap) + boxHeight / 2,
      }}
      dimensionUnits={note.dimensions}
      scale={1}
      triggerKey={null}
      inPreset={true}
    />)}
  </g>
}
