import React, { createContext, useRef } from 'react'

import JIPitchGroup from '@/components/JIPitchGroup'
import MousePitch from '@/components/MousePitch'
import TETPitchGroup from '@/components/TETPtichGroup'

interface JIConstraint {
  maxPrime: number
  maxFactor: number
  maxDivision: number
}

interface PitchCircleProps {
  baseFrequency: number
  radius: number
  center: { x: number, y: number }
  defaultOctaveShift?: number
  JIConstraint?: JIConstraint
}

const defaultJIConstraint: JIConstraint = {
  maxPrime: 13,
  maxFactor: 15,
  maxDivision: 10,
}

const PitchCircleContext = createContext<{
  baseFrequency: number
  radius: number
  center: { x: number, y: number }
  octaveShiftRef: React.RefObject<number> | null
  JIConstraint: JIConstraint
}>({
  baseFrequency: 440 * Math.pow(2, -9 / 12), // Middle C
  radius: 400,
  center: { x: 500, y: 500 },
  octaveShiftRef: null,
  JIConstraint: defaultJIConstraint,
})

const PitchCircle: React.FC<PitchCircleProps> = ({
  baseFrequency,
  radius,
  center,
  defaultOctaveShift = 1,
  JIConstraint = defaultJIConstraint,
}) => {
  const octaveShiftRef = useRef<number>(defaultOctaveShift)

  return <PitchCircleContext.Provider
    value={{
      baseFrequency,
      radius,
      center,
      octaveShiftRef,
      JIConstraint,
    }}
  >
    <g>
      <circle cx={center.x} cy={center.y} r={radius} fill="none" stroke="#888" />
      <JIPitchGroup
        showButtons={false}
        triggerKeys={['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace']}
      />
      <TETPitchGroup
        showButtons={true}
        TET={12}
        triggerKeys={['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']']}
      />
      <MousePitch />
    </g>
  </PitchCircleContext.Provider>
}

export default PitchCircle
export { PitchCircleContext }
