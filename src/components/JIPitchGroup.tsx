import React, { useContext } from 'react'

import Pitch from '@/components/Pitch'
import { PitchCircleContext } from '@/components/PitchCircle'

import { getOvertonePitches } from '@/utils/prime'

interface JIPitchGroupProps {
  showButtons?: boolean
  triggerKeys?: string[]
}

const JIPitchGroup: React.FC<JIPitchGroupProps> = ({
  showButtons = true,
  triggerKeys = [],
}) => {
  const {
    baseFrequency,
    octaveShiftRef,
    JIConstraint: {
      maxPrime,
      maxFactor,
      maxDivision,
    },
  } = useContext(PitchCircleContext)
  const octaveShift = octaveShiftRef?.current || 0

  const tones = getOvertonePitches(maxPrime, maxFactor, maxDivision)

  return <g>
    {tones.map((tone, index) => {
      const triggerKey = triggerKeys[index] || null
      return (
        <Pitch
          show={showButtons}
          key={tone.pitch}
          frequency={baseFrequency * Math.pow(2, octaveShift + tone.pitch)}
          triggerKey={triggerKey}
        />
      )
    })}
  </g>
}

export default JIPitchGroup
