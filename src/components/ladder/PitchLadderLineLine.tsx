import React, { useContext } from 'react'

import PitchLadderContext from '@/context/PitchLadderContext'
import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

import Note from '@/types/Note'
import { getAngle, getPositionOnLineSegment, getVerticalEndpoints, mapRange } from '@/utils/math'

const PitchLadderLineLine: React.FC<{
  note: Note
  color: string
  shrink?: number
}> = ({ note, color, shrink = 0 }) => {
  const { startPitch, endPitch } = useContext(PitchVisualizeSystemContext)
  const { startPoint, endPoint, width } = React.useContext(PitchLadderContext)

  const ratio = mapRange([startPitch, endPitch], [0, 1], note.pitch)
  const point = getPositionOnLineSegment([startPoint, endPoint], ratio)
  const angle = getAngle(startPoint, endPoint)
  const endPoints = getVerticalEndpoints(point, width * (1 - shrink), angle)

  const endPointsValues = {
    x1: endPoints[0].x,
    y1: endPoints[0].y,
    x2: endPoints[1].x,
    y2: endPoints[1].y,
  }

  return <line
    className="pitch-ladder-line"
    key={note.pitch}
    {...endPointsValues}
    stroke={color}
    width={0.5}
  />
}

export default PitchLadderLineLine
