import React, { useContext } from 'react'

import PitchCircleContext from '@/context/PitchCircleContext'
import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

import Note from '@/types/Note'

interface PitchLineProps {
  note: Note
  color: string
  width?: number
}

const PitchLine: React.FC<PitchLineProps> = ({ note, color, width = .5 }) => {
  const { center, startRadius, radiusStep } = useContext(PitchCircleContext)
  const { startPitch } = useContext(PitchVisualizeSystemContext)
  const length = note.length(startRadius, radiusStep, startPitch)
  const x = center.x + length * Math.cos(note.angle)
  const y = center.y + length * Math.sin(note.angle)

  return <line
    className="pitch-line"
    x1={center.x}
    y1={center.y}
    x2={x}
    y2={y}
    stroke={color}
    strokeWidth={width}
  />
}

export default PitchLine
