import React, { useContext, useEffect } from 'react'

import Arrow from '@/components/Arrow'
import PitchLadderLineLine from '@/components/ladder/PitchLadderLineLine'

import PitchLadderContext from '@/context/PitchLadderContext'
import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

import { R_180 } from '@/types/constants'
import Note from '@/types/Note'
import { getAngle, getPointByRadiusAndAngle } from '@/utils/math'

const LadderNoteIndicator: React.FC = () => {
  const {
    audioManager,
    baseFrequency,
    startPitch,
    endPitch,
  } = useContext(PitchVisualizeSystemContext)
  const { startPoint, endPoint } = React.useContext(PitchLadderContext)

  const [frequencies, setFrequencies] = React.useState<number[]>(
    audioManager?.frequencyList || [],
  )

  const notes = frequencies.map(frequency =>
    new Note({ baseFrequency, type: 'frequency', value: frequency }),
  )

  const ups = notes.filter(note => note.pitch > endPitch)
  const downs = notes.filter(note => note.pitch < startPitch)
  const rest = notes.filter(note => note.pitch >= startPitch && note.pitch <= endPitch)

  const angle = getAngle(startPoint, endPoint)
  const uc = (i: number) => getPointByRadiusAndAngle(endPoint, 10 + 5 * i, angle)
  const dc = (i: number) => getPointByRadiusAndAngle(startPoint, 10 + 5 * i, angle + R_180)

  useEffect(() => {
    const removeSubscription = audioManager?.subscribe(
      () => setFrequencies(audioManager?.frequencyList || []),
    )
    return () => { removeSubscription?.() }
  }, [audioManager])

  return <g>
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
