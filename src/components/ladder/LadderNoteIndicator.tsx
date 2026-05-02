import React, { useContext } from 'react'

import Arrow from '@/components/Arrow'
import PitchLadderLineLine from '@/components/ladder/PitchLadderLineLine'

import PitchLadderContext from '@/context/PitchLadderContext'
import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'
import { usePlayingFrequencies } from '@/hooks/usePlayingFrequencies'

import { getAngle, getPointByRadiusAndAngle } from '@/utils/math'

import { R_180 } from '@/types/constants'
import Note from '@/types/Note'

const LadderNoteIndicator: React.FC = () => {
  const {
    baseFrequency,
    startPitch,
    endPitch,
  } = useContext(PitchVisualizeSystemContext)
  const { startPoint, endPoint } = React.useContext(PitchLadderContext)

  const { frequencies } = usePlayingFrequencies()

  const notes = frequencies.map(frequency =>
    new Note({ baseFrequency, type: 'frequency', value: frequency }),
  )

  const ups = notes.filter(note => note.pitch > endPitch)
  const downs = notes.filter(note => note.pitch < startPitch)
  const rest = notes.filter(note => note.pitch >= startPitch && note.pitch <= endPitch)

  const angle = getAngle(startPoint, endPoint)
  const uc = (i: number) => getPointByRadiusAndAngle(endPoint, 10 + 5 * i, angle)
  const dc = (i: number) => getPointByRadiusAndAngle(startPoint, 10 + 5 * i, angle + R_180)

  return <g
    fontSize="10"
    fill="white"
    textAnchor="middle"
  >
    {ups.map((_, index) =>
      <Arrow
        key={index}
        c={uc(index)}
        angle={angle}
      />,
    )}
    {rest.map((note, index) =>
      <React.Fragment key={`${index}-${note.frequency}`}>
        <PitchLadderLineLine
          note={note}
          color="white"
          shrink={-0.2}
        />
      </React.Fragment>,
    )}
    {downs.map((_, index) =>
      <Arrow
        key={index}
        c={dc(index)}
        angle={angle + R_180}
      />,
    )}
  </g>
}

export default LadderNoteIndicator
