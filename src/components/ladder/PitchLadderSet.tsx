import React from 'react'

import PitchLadderLineWrapper from '@/components/ladder/PitchLadderLineWrapper'

import Note from '@/types/Note'

interface PitchLadderSetProps {
  isPlayable?: boolean
  pitches: {
    note: Note
    color: string
    shrink: number
  }[]
}

const PitchLadderSet: React.FC<PitchLadderSetProps> = ({
  isPlayable = true,
  pitches,
}) => <g style={{ opacity: isPlayable ? 1 : 0.2 }}>
  {pitches.map(({ note, color, shrink }) =>
    <PitchLadderLineWrapper
      key={note.pitch}
      isPlayable={isPlayable}
      note={note}
      color={color}
      shrink={shrink}
    />,
  )}
</g>

export default PitchLadderSet
