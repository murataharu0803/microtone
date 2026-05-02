import React, { useContext } from 'react'

import PitchLine from '@/components/circle/PitchLine'

import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'
import { usePlayingFrequencies } from '@/hooks/usePlayingFrequencies'

import Note from '@/types/Note'

const NoteIndicator: React.FC = () => {
  const { baseFrequency } = useContext(PitchVisualizeSystemContext)

  const { frequencies } = usePlayingFrequencies()

  return <g
    fontSize="10"
    fill="white"
    textAnchor="middle"
  >
    {frequencies.map((frequency, index) =>
      <React.Fragment key={`${index}-${frequency}`}>
        <PitchLine
          note={new Note({ baseFrequency, type: 'frequency', value: frequency })}
          color="white"
          width={1}
        />
      </React.Fragment>,
    )}
  </g>
}

export default NoteIndicator
