import React, { createContext, useState } from 'react'

import CenterDisplay from '@/components/CenterDisplay'
import JIPitchGroup from '@/components/JIPitchGroup'
import NoteIndicator from '@/components/NoteIndicator'
import PitchCircleMouse from '@/components/PitchCircleMouse'
import { PitchVisualizeSystemContext } from '@/components/PitchVisualizeSystem'
import TETPitchGroup from '@/components/TETPtichGroup'

import { useKey } from '@/hooks/useKey'

import AudioManager from '@/utils/AudioManager'
import spiral from '@/utils/spiral'

interface PitchCircleProps {
  center: { x: number, y: number }
  startRadius: number
  radiusStep: number
  defaultOctaveShift?: number
}


const PitchCircleContext = createContext<{
  center: { x: number, y: number }
  startRadius: number
  radiusStep: number
}>({
  center: { x: 500, y: 500 },
  startRadius: 150,
  radiusStep: 400,
})


const PitchCircle: React.FC<PitchCircleProps> = ({
  center,
  startRadius,
  radiusStep,
}) => {
  const { startPitch, endPitch } = React.useContext(PitchVisualizeSystemContext)

  const [isSnapped, setIsSnapped] = useState(true)
  const [snapToJI, setSnapToJI] = useState(false)

  const audioManager = React.useRef<AudioManager>(new AudioManager())

  useKey(
    'Shift',
    () => { setIsSnapped(false); audioManager.current.stopAll() },
    () => { setIsSnapped(true); audioManager.current.stopAll() },
  )

  useKey(
    'Control',
    () => { setSnapToJI(true); audioManager.current.stopAll() },
    () => { setSnapToJI(false); audioManager.current.stopAll() },
  )

  const startTheta = startPitch * 2 * Math.PI - Math.PI / 2
  const endTheta = endPitch * 2 * Math.PI - Math.PI / 2

  return <PitchCircleContext.Provider
    value={{
      center,
      startRadius,
      radiusStep,
    }}
  >
    <g>
      <path d={spiral(center, startRadius, radiusStep, startTheta, endTheta, 0.1)} stroke="#888"/>
      <NoteIndicator />
      <JIPitchGroup
        isPlayable={isSnapped && snapToJI}
        triggerKeys={['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace']}
      />
      {!isSnapped && <PitchCircleMouse />}
      <TETPitchGroup
        isPlayable={isSnapped && !snapToJI}
        TET={12}
        triggerKeys={['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']']}
      />
      <CenterDisplay />
    </g>
  </PitchCircleContext.Provider>
}

export default PitchCircle
export { PitchCircleContext }
