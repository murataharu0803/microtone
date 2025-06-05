import React, { useContext } from 'react'

import PitchButton from '@/components/PitchButton'
import { PitchLine } from '@/components/PitchLine'
import { PitchVisualizeSystemContext } from '@/components/PitchVisualizeSystem'

import Note from '@/utils/Note'
import { findFurthest } from '@/utils/math'
import { ERROR_MARGIN } from '@/utils/pitchNotation'
import { getOvertones } from '@/utils/prime'

interface JIPitchGroupProps {
  isPlayable?: boolean
  triggerKeys?: string[]
}

const JIPitchGroup: React.FC<JIPitchGroupProps> = ({
  isPlayable = true,
  triggerKeys = [],
}) => {
  const {
    JIConstraint,
    baseFrequency,
    startPitch,
    endPitch,
  } = useContext(PitchVisualizeSystemContext)

  const tones = getOvertones(JIConstraint)
  const octaves = Array.from(
    { length: Math.ceil(endPitch) - Math.floor(startPitch) + 1 },
    (_, i) => i + Math.floor(startPitch),
  )

  const allTones = tones.map((tone, index) =>
    octaves.map(octave => ({
      color: tone.color,
      note: new Note({ baseFrequency, type: 'pitch', value: tone.noteClass.pitchClass + octave }),
      triggerKey: octave === 1 ? triggerKeys[index] : null,
    })).filter(tone => tone.note.pitch >= startPitch && tone.note.pitch <= endPitch),
  ).flat()

  return <g>
    {tones.map(tone => {
      const note = findFurthest(
        allTones.filter(t =>
          Math.abs(t.note.pitchClass - tone.noteClass.pitchClass) < ERROR_MARGIN,
        ),
        t => t.note.pitch,
      ).note
      return <PitchLine key={`JI-${note.pitchClass}`} note={note} color={tone.color} />
    })}
    {isPlayable && allTones.reverse().map(tone =>
      <g key={tone.note.octave + tone.note.pitch}>
        {isPlayable && <PitchLine note={tone.note} color={tone.color} />}
        <PitchButton
          isPlayable={isPlayable}
          note={tone.note}
          color={tone.color}
          triggerKey={tone.triggerKey}
        />
      </g>,
    )}
  </g>
}

export default JIPitchGroup
