import React, { useContext } from 'react'

import Pitch from '@/components/Pitch'
import { PitchCircleContext } from '@/components/PitchCircle'

interface TETPitchGroupProps {
  showButtons?: boolean
  TET: number
  triggerKeys?: string[]
}

const TETPitchGroup: React.FC<TETPitchGroupProps> = ({
  showButtons = true,
  TET = 12,
  triggerKeys = [],
}) => {
  const { baseFrequency, octaveShiftRef } = useContext(PitchCircleContext)

  return <g>
    {Array.from({ length: TET }, (_, step) =>
      <Pitch
        show={showButtons}
        key={step}
        frequency={baseFrequency * Math.pow(2, step / TET + (octaveShiftRef?.current || 0))}
        triggerKey={triggerKeys[step] || null}
      />,
    )}
  </g>
}

export default TETPitchGroup
