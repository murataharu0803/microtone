import React, { useContext } from 'react'

import { PitchCircleContext } from '@/components/PitchCircle'

import { PitchLine } from '@/components/PitchLine'
import Note from '@/utils/Note'


const NoteIndicator: React.FC = () => {
  const { audioManager, baseFrequency } = useContext(PitchCircleContext)

  const [frequencies, setFrequencies] = React.useState<number[]>(
    audioManager.current?.frequencyList || [],
  )

  audioManager.current?.subscribe(
    () => setFrequencies(audioManager.current?.frequencyList || []),
  )

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
