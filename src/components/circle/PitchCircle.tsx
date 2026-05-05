import React, { useState } from 'react'

import CenterDisplay from '@/components/circle/CenterDisplay'
import NoteIndicator from '@/components/circle/NoteIndicator'
import PitchCircleMouse from '@/components/circle/PitchCircleMouse'
import TETPitchGroup from '@/components/circle/TETPitchGroup'

import PitchCircleContext from '@/context/PitchCircleContext'
import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

import { useKey } from '@/hooks/useKey'

import { spiral } from '@/utils/spiral'

import Position from '@/types/Position'
import { R_360, R_90 } from '@/utils/math'

interface PitchCircleProps {
  center: Position
  startRadius: number
  radiusStep: number
  mouseSnap: number
}

const PitchCircle: React.FC<PitchCircleProps> = ({
  center,
  startRadius,
  radiusStep,
  mouseSnap,
}) => {
  const { startPitch, endPitch } = React.useContext(PitchVisualizeSystemContext)

  const [isSnapped, setIsSnapped] = useState(true)

  useKey(
    'Shift',
    () => { setIsSnapped(false) },
    () => { setIsSnapped(true) },
  )

  const startTheta = startPitch * R_360 - R_90
  const endTheta = endPitch * R_360 - R_90

  return <PitchCircleContext.Provider
    value={{
      center,
      startRadius,
      radiusStep,
      mouseSnap,
    }}
  >
    <g>
      <path d={spiral(center, startRadius, radiusStep, startTheta, endTheta, 0.1)} stroke="#888"/>
      <NoteIndicator />
      {!isSnapped && <PitchCircleMouse />}
      <TETPitchGroup
        isPlayable={isSnapped}
        TET={12}
      />
      <CenterDisplay />
    </g>
  </PitchCircleContext.Provider>
}

export default PitchCircle
