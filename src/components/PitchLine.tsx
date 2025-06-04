import React, { useContext } from 'react'

import { PitchCircleContext } from '@/components/PitchCircle'

interface PitchLineProps {
  pitch: number
  octave?: number
  color: string
}

export const PitchLine: React.FC<PitchLineProps> = ({
  pitch,
  octave,
  color,
}) => {
  const {
    center,
    startRadius,
    radiusStep,
    startPitch,
    endPitch,
  } = useContext(PitchCircleContext)

  const angle = pitch * 2 * Math.PI - Math.PI / 2
  const curPitch = (() => {
    if (octave !== undefined) return pitch % 1 + octave
    const startOctave = Math.floor(startPitch)
    let curPitch = pitch % 1 + startOctave
    while (curPitch + 1 <= endPitch) curPitch += 1
    if (curPitch < startPitch) return null
    return curPitch
  })()
  if (!curPitch) return null

  const length = startRadius + radiusStep * (curPitch - startPitch)

  const x = center.x + length * Math.cos(angle)
  const y = center.y + length * Math.sin(angle)

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
