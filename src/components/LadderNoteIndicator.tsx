import React, { useContext, useEffect } from 'react'

import PitchLadderLineLine from '@/components/PitchLadderLineLine'
import { PitchVisualizeSystemContext } from '@/components/PitchVisualizeSystem'

import Note from '@/utils/Note'

const LadderNoteIndicator: React.FC = () => {
  const { audioManager, baseFrequency } = useContext(PitchVisualizeSystemContext)

  const [frequencies, setFrequencies] = React.useState<number[]>(
    audioManager.current?.frequencyList || [],
  )

  useEffect(() => {
    const removeSubscription = audioManager.current?.subscribe(
      () => setFrequencies(audioManager.current?.frequencyList || []),
    )
    return () => { removeSubscription?.() }
  }, [audioManager])

  return <g
    fontSize="10"
    fill="white"
    textAnchor="middle"
  >
    {frequencies.map((frequency, index) =>
      <React.Fragment key={`${index}-${frequency}`}>
        <PitchLadderLineLine
          note={new Note({ baseFrequency, type: 'frequency', value: frequency })}
          color="white"
          shrink={-0.2}
        />
      </React.Fragment>,
    )}
  </g>
}

export default LadderNoteIndicator
