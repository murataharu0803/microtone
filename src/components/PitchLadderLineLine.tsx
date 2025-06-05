import React, { useContext } from 'react'

import { PitchLadderContext } from '@/components/PitchLadder'
import { PitchVisualizeSystemContext } from '@/components/PitchVisualizeSystem'

import Note from '@/utils/Note'

const PitchLadderLineLine: React.FC<{
  note: Note
  color: string
  shrink?: number
}> = ({ note, color, shrink = 0 }) => {
  const { startPitch, endPitch } = useContext(PitchVisualizeSystemContext)
  const { startPoint, endPoint, width } = React.useContext(PitchLadderContext)

  const getLineEndPoints = () => {
    const pitch = note.pitch
    const range = endPitch - startPitch
    const ratio =  (pitch - startPitch) / range
    const pos = {
      x: startPoint.x + ratio * (endPoint.x - startPoint.x),
      y: startPoint.y + ratio * (endPoint.y - startPoint.y),
    }

    const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x)
    const theta1 = angle + Math.PI / 2
    const theta2 = angle - Math.PI / 2

    return {
      x1: pos.x + width * (1 - shrink) / 2 * Math.cos(theta1),
      y1: pos.y + width * (1 - shrink) / 2 * Math.sin(theta1),
      x2: pos.x + width * (1 - shrink) / 2 * Math.cos(theta2),
      y2: pos.y + width * (1 - shrink) / 2 * Math.sin(theta2),
    }
  }

  return <line
    className="pitch-ladder-line"
    key={note.pitch}
    {...getLineEndPoints()}
    stroke={color}
    width={0.5}
  />
}

export default PitchLadderLineLine
