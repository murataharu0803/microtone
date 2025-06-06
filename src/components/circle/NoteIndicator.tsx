import React, { useContext, useEffect } from 'react'

import { PitchLine } from '@/components/circle/PitchLine'
import { PitchVisualizeSystemContext } from '@/components/PitchVisualizeSystem'

import Note from '@/utils/Note'

const NoteIndicator: React.FC = () => {
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
