import React, { useContext } from 'react'

import PitchButton from '@/components/PitchButton'
import { PitchLine } from '@/components/PitchLine'
import { PitchVisualizeSystemContext } from '@/components/PitchVisualizeSystem'
import Note, { NoteClass } from '@/utils/Note'
import { findFurthest } from '@/utils/math'

interface TETPitchGroupProps {
  isPlayable?: boolean
  TET: number
  triggerKeys?: string[]
}

const TETPitchGroup: React.FC<TETPitchGroupProps> = ({
  isPlayable = true,
  TET = 12,
  triggerKeys = [],
}) => {
  const {
    baseFrequency,
    startPitch,
    endPitch,
  } = useContext(PitchVisualizeSystemContext)

  const octaves = Array.from(
    { length: Math.ceil(endPitch) - Math.floor(startPitch) + 1 },
    (_, i) => i + Math.floor(startPitch),
  )
  const tones = Array.from({ length: TET }, (_, step) => ({
    noteClass: new NoteClass({ type: 'pitch', value: step / TET }),
    step,
  }))

  const allTones = tones.map(tone =>
    octaves.map(octave => ({
      step: tone.step,
      note: new Note({ baseFrequency, type: 'pitch', value: tone.noteClass.pitchClass + octave }),
      triggerKey: octave === 1 ? triggerKeys[tone.step] : null,
    })).filter(tone => tone.note.pitch >= startPitch && tone.note.pitch <= endPitch),
  ).flat()

  return <g>
    {tones.map(tone => {
      const note = findFurthest(
        allTones.filter(t => t.step === tone.step),
        t => t.note.pitch,
      ).note
      return <PitchLine key={`${TET}-TET-${tone.step}`} note={note} color="#888888" />
    })}
    {isPlayable && allTones.reverse().map(tone =>
      <PitchButton
        key={tone.note.octave + tone.note.pitch}
        isPlayable={isPlayable}
        note={tone.note}
        triggerKey={tone.triggerKey}
      />,
    )}
  </g>
}

export default TETPitchGroup
