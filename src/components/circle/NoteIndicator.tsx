import React, { useContext, useEffect } from 'react'

import PitchLine from '@/components/circle/PitchLine'

import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

import Note from '@/types/Note'

const NoteIndicator: React.FC = () => {
  const { audioManager, baseFrequency } = useContext(PitchVisualizeSystemContext)

  const [frequencies, setFrequencies] = React.useState<number[]>(
    audioManager?.frequencyList || [],
  )

  useEffect(() => {
    const removeSubscription = audioManager?.subscribe(
      () => setFrequencies(audioManager?.frequencyList || []),
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
