import React, { createContext, useState } from 'react'

import CenterDisplay from '@/components/CenterDisplay'
import JIPitchGroup from '@/components/JIPitchGroup'
import MousePitch from '@/components/MousePitch'
import TETPitchGroup from '@/components/TETPtichGroup'

import { useKey } from '@/hooks/useKey'


import AudioManager from '@/utils/AudioManager'
import { JIConstraint } from '@/utils/Note'
import spiral from '@/utils/spiral'

interface PitchCircleProps {
  baseFrequency: number
  center: { x: number, y: number }
  startPitch: number
  endPitch: number
  startRadius: number
  radiusStep: number
  defaultOctaveShift?: number
  JIConstraint?: JIConstraint
}

const defaultJIConstraint: JIConstraint = {
  maxPrime: 13,
  maxFactor: 15,
  maxDivision: 10,
}

/* eslint-disable @stylistic/indent */
const PitchCircleContext = createContext<{
  baseFrequency: number
  center: { x: number, y: number }
  startPitch: number
  endPitch: number
  startRadius: number
  radiusStep: number
  JIConstraint: JIConstraint
  audioManager: React.RefObject<AudioManager | null>
  playNote: (frequency: number, token?: string) => string | null
  stopNote: (token: string) => string | null
}>({
  baseFrequency: 440 * Math.pow(2, -9 / 12), // Middle C
  center: { x: 500, y: 500 },
  startPitch: -2,
  endPitch: 3,
  startRadius: 150,
  radiusStep: 400,
  JIConstraint: defaultJIConstraint,
  audioManager: React.createRef<AudioManager>(),
  playNote: () => null,
  stopNote: () => null,
})
/* eslint-enable @stylistic/indent */

const PitchCircle: React.FC<PitchCircleProps> = ({
  baseFrequency,
  center,
  startPitch,
  endPitch,
  startRadius,
  radiusStep,
  JIConstraint = defaultJIConstraint,
}) => {
  const [isSnapped, setIsSnapped] = useState(true)

  const audioManager = React.useRef<AudioManager>(new AudioManager())

  useKey(
    'Shift',
    () => { setIsSnapped(false); audioManager.current.stopAll() },
    () => { setIsSnapped(true); audioManager.current.stopAll() },
  )

  const startTheta = startPitch * 2 * Math.PI - Math.PI / 2
  const endTheta = endPitch * 2 * Math.PI - Math.PI / 2

  return <PitchCircleContext.Provider
    value={{
      baseFrequency,
      center,
      startPitch,
      endPitch,
      startRadius,
      radiusStep,
      JIConstraint,
      audioManager,
      playNote: audioManager.current.play.bind(audioManager.current),
      stopNote: audioManager.current.stop.bind(audioManager.current),
    }}
  >
    <g>
      <path d={spiral(center, startRadius, radiusStep, startTheta, endTheta, 0.1)} stroke="#888"/>
      <JIPitchGroup
        triggerKeys={['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace']}
      />
      {!isSnapped && <MousePitch />}
      <TETPitchGroup
        isPlayable={isSnapped}
        TET={12}
        triggerKeys={['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']']}
      />
      <CenterDisplay />
    </g>
  </PitchCircleContext.Provider>
}

export default PitchCircle
export { PitchCircleContext }
