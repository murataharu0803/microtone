import React, { useContext } from 'react'

import PitchButton from '@/components/circle/PitchButton'
import PitchLine from '@/components/circle/PitchLine'

import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

import { findFurthest } from '@/utils/math'
import { getOvertones } from '@/utils/overtones'
import { ERROR_MARGIN } from '@/utils/pitchNotation'

import Note from '@/types/Note'

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
        {/* {isPlayable && <PitchLine note={tone.note} color={tone.color} />} */}
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
