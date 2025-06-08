import React, { useContext } from 'react'

import PitchCircleContext from '@/context/PitchCircleContext'
import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

import Note from '@/types/Note'
import { getPointByRadiusAndAngle } from '@/utils/math'

interface PitchLineProps {
  note: Note
  color: string
  width?: number
}

const PitchLine: React.FC<PitchLineProps> = ({ note, color, width = .5 }) => {
  const { center, startRadius, radiusStep } = useContext(PitchCircleContext)
  const { startPitch } = useContext(PitchVisualizeSystemContext)
  const length = note.length(startRadius, radiusStep, startPitch)
  const point = getPointByRadiusAndAngle(center, length, note.angle)

  return <line
    className="pitch-line"
    x1={center.x}
    y1={center.y}
    x2={point.x}
    y2={point.y}
    stroke={color}
    strokeWidth={width}
  />
}

export default PitchLine
