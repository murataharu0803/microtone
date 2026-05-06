import Position from '@/types/Position'
import { getPointByRadiusAndAngle, R_180, R_90 } from '@/utils/math'
import React from 'react'

interface ArrowProps {
  c: Position
  angle: number
  spreadAngle?: number
  color?: string
  length?: number
  isTriangle?: boolean
  solid?: boolean
}

const Arrow: React.FC<ArrowProps> = ({
  c,
  angle,
  spreadAngle = R_90,
  color = 'currentColor',
  length = 5,
  isTriangle = false,
  solid = false,
}) => {
  const angle1 = angle - R_180 + spreadAngle / 2
  const angle2 = angle + R_180 - spreadAngle / 2
  const p1 = getPointByRadiusAndAngle(c, length, angle1)
  const p2 = getPointByRadiusAndAngle(c, length, angle2)
  const d = `M${p1.x},${p1.y} L${c.x},${c.y} L${p2.x},${p2.y}${isTriangle ? ' Z' : ''}`
  return <g>
    <path
      d={d}
      stroke={color}
      strokeWidth={1}
      fill={solid ? color : 'transparent'}
    />
  </g>
}

export default Arrow
