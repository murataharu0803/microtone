import React, { useContext } from 'react'

import PitchButton from '@/components/circle/PitchButton'
import PitchLine from '@/components/circle/PitchLine'

import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

import { getOvertones } from '@/utils/dimension'

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

  const tones = getOvertones(JIConstraint, [startPitch, endPitch])

  const allTones = tones.map((tone, index) => ({
    color: tone.color,
    note: new Note({ baseFrequency, type: 'pitch', value: tone.pitch }),
    triggerKey: triggerKeys[index],
    noteSymbol: tone.noteSymbol,
  }))

  return <g>
    {isPlayable && allTones.reverse().map(tone =>
      <g key={tone.noteSymbol}>
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
