import React, { useContext } from 'react'

import Arrow from '@/components/Arrow'
import PitchLadderLine from '@/components/ladder/PitchLadderLine'

import PitchLadderContext from '@/context/PitchLadderContext'
import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'
import { usePlayingFrequencies } from '@/hooks/usePlayingFrequencies'

import { getAngle, getPointByRadiusAndAngle } from '@/utils/math'

import PitchLadderLabel from '@/components/ladder/PitchLadderLabel'
import { usePlayingJINotes } from '@/hooks/usePlayingJINotes'
import Note from '@/types/Note'
import { R_180 } from '@/utils/math'

const LadderNoteIndicator: React.FC = () => {
  const {
    baseFrequency,
    startPitch,
    endPitch,
  } = useContext(PitchVisualizeSystemContext)
  const { startPoint, endPoint } = React.useContext(PitchLadderContext)

  const { frequencies } = usePlayingFrequencies()
  const { jiNotes } = usePlayingJINotes()

  const notes = frequencies.map(frequency =>
    new Note({ baseFrequency, type: 'frequency', value: frequency }),
  )
  const jiNotesInRange = jiNotes.filter(note => note.pitch >= startPitch && note.pitch <= endPitch)

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
        <PitchLadderLine
          note={note}
          color="white"
          shrink={-0.2}
        />
      </React.Fragment>,
    )}
    {jiNotesInRange.map((note, index) =>
      <React.Fragment key={`${index}-${note.letterNotation}`}>
        <PitchLadderLabel
          note={note}
          name={note.harmononym}
          color={note.color}
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
