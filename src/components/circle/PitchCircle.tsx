import React, { useState } from 'react'

import CenterDisplay from '@/components/circle/CenterDisplay'
import JIPitchGroup from '@/components/circle/JIPitchGroup'
import NoteIndicator from '@/components/circle/NoteIndicator'
import PitchCircleMouse from '@/components/circle/PitchCircleMouse'
import TETPitchGroup from '@/components/circle/TETPtichGroup'

import PitchCircleContext from '@/context/PitchCircleContext'
import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

import { useKey } from '@/hooks/useKey'

import { spiral } from '@/utils/spiral'

import AudioManager from '@/types/AudioManager'
import Position from '@/types/Position'
import { R_360, R_90 } from '@/types/constants'

interface PitchCircleProps {
  center: Position
  startRadius: number
  radiusStep: number
}

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

  const startTheta = startPitch * R_360 - R_90
  const endTheta = endPitch * R_360 - R_90

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
        // triggerKeys={['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace']}
      />
      {!isSnapped && <PitchCircleMouse />}
      <TETPitchGroup
        isPlayable={isSnapped && !snapToJI}
        TET={12}
        // triggerKeys={['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']']}
      />
      <CenterDisplay />
    </g>
  </PitchCircleContext.Provider>
}

export default PitchCircle
