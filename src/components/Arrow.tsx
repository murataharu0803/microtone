import Position from '@/types/Position'
import { getPointByRadiusAndAngle } from '@/utils/math'
import React from 'react'

interface ArrowProps {
  c: Position
  angle: number
  color?: string
  length?: number
}

const Arrow: React.FC<ArrowProps> = ({
  c,
  angle,
  color = 'currentColor',
  length = 5,
}) => {
  const angle1 = angle + 3 * Math.PI / 4
  const angle2 = angle - 3 * Math.PI / 4
  const p1 = getPointByRadiusAndAngle(c, length, angle1)
  const p2 = getPointByRadiusAndAngle(c, length, angle2)
  return <g>
    <path
      d={`M${p1.x},${p1.y} L${c.x},${c.y} L${p2.x},${p2.y}`}
      stroke={color}
      strokeWidth={1}
      fill="transparent"
    />
  </g>
}

export default Arrow
