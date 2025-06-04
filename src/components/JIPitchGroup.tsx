import React, { useContext } from 'react'

import { PitchCircleContext } from '@/components/PitchCircle'
import { PitchLine } from '@/components/PitchLine'

import { getOvertonePitches } from '@/utils/prime'

interface JIPitchGroupProps {
  triggerKeys?: string[]
}

const JIPitchGroup: React.FC<JIPitchGroupProps> = () => {
  const {
    JIConstraint: {
      maxPrime,
      maxFactor,
      maxDivision,
    },
  } = useContext(PitchCircleContext)

  const tones = getOvertonePitches(maxPrime, maxFactor, maxDivision)

  return <g>
    {tones.map(tone => {
      return <PitchLine
        key={tone.pitch}
        pitch={tone.pitch}
        color={tone.color}
      />
    })}
  </g>
}

export default JIPitchGroup
