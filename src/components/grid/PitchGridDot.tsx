import React, { useContext, useRef } from 'react'

import Arrow from '@/components/Arrow'

import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

import { useNote } from '@/hooks/useNote'

import { getPointByRadiusAndAngle } from '@/utils/math'
import { OVERTONES_COLORS } from '@/utils/overtones'
import { getHalfSectorPath, getRingPath } from '@/utils/sector'

import { getFactorFromDimensions } from '@/types/Axis'
import Position from '@/types/Position'
import { DOWN, LEFT, R_180, RIGHT, UP } from '@/types/constants'

const ZERO_COLOR = '#444444'
const GAP = 4

const sectorGapMask = (
  id: string,
  center: Position,
  radius: number,
  angles: number[],
) => <mask id={id}>
  <rect width="100%" height="100%" fill="white" />
  {angles.map(angle => <line
    key={`${id}-${angle}`}
    x1={center.x}
    y1={center.y}
    x2={center.x + radius * Math.cos(angle)}
    y2={center.y + radius * Math.sin(angle)}
    stroke="black"
    strokeWidth={GAP}
  />)}
</mask>

const dividedRing = (
  id: string,
  center: Position,
  pos: 'out' | 'mid' | 'in',
  d: number,
  color: string,
) => {
  const radius = pos === 'out' ? 24 : pos === 'mid' ? 16 : 8
  const width = 4
  const innerRadius = pos === 'in' ? 0 : radius - width

  if (d === 0 && pos === 'out') {
    return <path
      fillRule='evenodd'
      d={getRingPath(center, innerRadius, radius)}
      fill={ZERO_COLOR}
    />
  }
  if (d === 0) return null

  const angles = Array.from({ length: Math.abs(d) - 1 }, (_, i) => -R_180 * (i + 1) / d)
  angles.push(LEFT, RIGHT)

  return <g>
    {Math.abs(d) >= 1 && <defs>
      {sectorGapMask(`sector-gap-mask-${id}-${pos}`, center, radius, angles)}
    </defs>}
    <g mask={`url(#sector-gap-mask-${id}-${pos})`}>
      <path
        d={getHalfSectorPath(center, innerRadius, radius, d > 0 ? 'up' : 'down')}
        fill={color}
      />
      {pos === 'out' && <path
        d={getHalfSectorPath(center, innerRadius, radius, d > 0 ? 'down' : 'up')}
        fill={ZERO_COLOR}
      />}
    </g>
  </g>
}

interface PitchGridDotProps {
  position: Position
  d1: number
  d2: number
  d3: number
  d?: number | null
  dn?: number
  triggerKey: string
}

const PitchGridDot: React.FC<PitchGridDotProps> = ({
  position,
  d1,
  d2,
  d3,
  d,
  dn = 0,
  triggerKey,
}) => {
  const {
    baseFrequency,
    startPitch,
    endPitch,
  } = useContext(PitchVisualizeSystemContext)
  const { axis } = useContext(PitchVisualizeSystemContext)

  const dimensions =
    [d1, d2, d3, d === 4 ? dn : 0, d === 5 ? dn : 0, d === 6 ? dn : 0]
  const factor = getFactorFromDimensions(dimensions, axis)
  const frequency = baseFrequency * factor
  const pitch = Math.log2(factor)
  const inRange = pitch >= startPitch && pitch <= endPitch

  const buttonRef = useRef<SVGCircleElement>(null)
  const { active } = useNote(frequency, buttonRef, triggerKey, dimensions)

  const { x, y } = getPointByRadiusAndAngle(position, 34, d1 > 0 ? UP : DOWN)

  return <g ref={buttonRef} style={{ opacity: inRange ? 1 : 0.25 }}>
    <circle
      cx={position.x}
      cy={position.y}
      r={24}
      fill={active ? '#444444' : 'transparent'}
    />
    {dividedRing(`d2-${d2}-d3-${d3}`, position, 'out', d2, OVERTONES_COLORS[1] || '#888888')}
    {dividedRing(`d2-${d2}-d3-${d3}`, position, 'mid', d3, OVERTONES_COLORS[2] || '#888888')}
    {d && dn &&
      dividedRing(`d2-${d2}-d3-${d3}`, position, 'in', dn, OVERTONES_COLORS[d - 1] || '#888888')
    }
    {Array.from({ length: Math.abs(d1) }, (_, i) => <Arrow
      key={i}
      c={{ x, y: y + 5 * i * (d1 > 0 ? -1 : 1) }}
      angle={d1 > 0 ? UP : DOWN}
      length={10}
      color={OVERTONES_COLORS[0] || '#888888'}
    />)}
  </g>
}

export default PitchGridDot
