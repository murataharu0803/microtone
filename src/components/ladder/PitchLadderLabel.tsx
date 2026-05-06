import React, { useContext } from 'react'

import PitchLadderContext from '@/context/PitchLadderContext'
import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

import Arrow from '@/components/Arrow'
import Note from '@/types/Note'
import {
  getAngle,
  getPointByRadiusAndAngle,
  getPositionOnLineSegment,
  mapRange,
  R_90,
} from '@/utils/math'

type PitchLadderLabelProps = {
  note: Note
  name: string
  color: string
}

const PitchLadderLabel: React.FC<PitchLadderLabelProps> = ({ note, color, name }) => {
  const { startPitch, endPitch } = useContext(PitchVisualizeSystemContext)
  const { startPoint, endPoint, width } = React.useContext(PitchLadderContext)

  const ratio = mapRange([startPitch, endPitch], [0, 1], note.pitch)
  const point = getPositionOnLineSegment([startPoint, endPoint], ratio)
  const angle = getAngle(startPoint, endPoint)
  const indicatorPoint = getPointByRadiusAndAngle(point, width * 0.7, angle + R_90)
  const labelPoint = getPointByRadiusAndAngle(point, width * 0.7 + 15, angle + R_90)
  const labelMiddlePoint = getPointByRadiusAndAngle(labelPoint, -4, angle)

  return <g className="pitch-ladder-label">
    <Arrow
      c={indicatorPoint}
      angle={angle - R_90}
      spreadAngle={R_90 / 2}
      color={color}
      length={10}
      isTriangle
      solid
    />
    <text
      x={labelMiddlePoint.x}
      y={labelMiddlePoint.y}
      fill={color}
      fontSize="12"
      textAnchor="start"
    >
      {name}
    </text>
  </g>
}

export default PitchLadderLabel
