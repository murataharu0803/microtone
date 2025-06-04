import React, { useContext } from 'react'

import { PitchCircleContext } from '@/components/PitchCircle'

import Note from '@/utils/Note'

interface PitchLineProps {
  note: Note
  color: string
}

export const PitchLine: React.FC<PitchLineProps> = ({ note, color }) => {
  const {
    center,
    startRadius,
    radiusStep,
    startPitch,
  } = useContext(PitchCircleContext)
  const length = note.length(startRadius, radiusStep, startPitch)
  const x = center.x + length * Math.cos(note.angle)
  const y = center.y + length * Math.sin(note.angle)

  return <g className="pitch-line">
    <line
      x1={center.x}
      y1={center.y}
      x2={x}
      y2={y}
      stroke={color}
      strokeWidth={0.5}
    />
  </g>
}
