import React, { useContext, useRef } from 'react'

import { PitchGridContext } from '@/components/grid/PitchGrid'

import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

import { Dimension, DIMENSION_COLORS, PRIMES } from '@/utils/overtones'
import { getHalfSectorPath, getRingPath } from '@/utils/sector'

import { useNote } from '@/hooks/useNote'

import Arrow from '@/components/Arrow'
import Position from '@/types/Position'
import { DOWN, R_180, R_90, UP } from '@/types/constants'
import { getPointByRadiusAndAngle } from '@/utils/math'

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
  dir: number,
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

  const angles = Array.from(
    { length: Math.abs(d) - 1 }, (_, i) => dir - R_90 + R_180 * (i + 1) / d,
  )
  angles.push(dir - R_90, dir + R_90)

  return <g>
    {Math.abs(d) >= 1 && <defs>
      {sectorGapMask(`sector-gap-mask-${id}-${pos}`, center, radius, angles)}
    </defs>}
    <g mask={`url(#sector-gap-mask-${id}-${pos})`}>
      <path
        d={getHalfSectorPath(center, innerRadius, radius, d > 0 ? dir : dir + R_180)}
        fill={color}
      />
      {pos === 'out' && <path
        d={getHalfSectorPath(center, innerRadius, radius, d > 0 ? dir + R_180 : dir)}
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

const PitchGridDot: React.FC<PitchGridDotProps> = ({ position, d1, d2, d3, d, dn, triggerKey }) => {
  const {
    baseFrequency,
    startPitch,
    endPitch,
  } = useContext(PitchVisualizeSystemContext)
  const { axis } = useContext(PitchGridContext)

  const power1 = axis[0].factor
  const power2 = axis[1].factor
  const power3 = axis[2].factor
  const powerN = d ? axis[d - 1]?.factor || [] : []
  const factors = PRIMES.map((p, i) => {
    const power = (dn || 0) * (powerN[i] || 0) +
      d1 * (power1[i] || 0) +
      d2 * (power2[i] || 0) +
      d3 * (power3[i] || 0)
    return Math.pow(p, power)
  })
  const factor = factors.reduce((acc, val) => acc * val, 1)
  const frequency = baseFrequency * factor
  const pitch = Math.log2(factor)
  const inRange = pitch >= startPitch && pitch <= endPitch

  const buttonRef = useRef<SVGCircleElement>(null)
  const { active } = useNote(frequency, buttonRef, triggerKey)

  const { x, y } = getPointByRadiusAndAngle(position, 34, d1 > 0 ? UP : DOWN)

  return <g ref={buttonRef} style={{ opacity: inRange ? 1 : 0.25 }}>
    <circle
      cx={position.x}
      cy={position.y}
      r={24}
      fill={active ? '#444444' : 'transparent'}
    />
    {dividedRing(
      `d2-${d2}-d3-${d3}`,
      position,
      'out',
      d2,
      DIMENSION_COLORS[Dimension.D2] || '#888888',
      0,
    )}
    {dividedRing(
      `d2-${d2}-d3-${d3}`,
      position,
      'mid',
      d3,
      DIMENSION_COLORS[Dimension.D3] || '#888888',
      -R_90,
    )}
    {d && dn && dividedRing(
      `d2-${d2}-d3-${d3}`,
      position,
      'in',
      dn,
      DIMENSION_COLORS[Dimension[`D${d}` as keyof typeof Dimension]] || '#888888',
      - R_90 / 2,
    )}
    {Array.from({ length: Math.abs(d1) }, (_, i) => <Arrow
      key={i}
      c={{ x, y: y + 5 * i * (d1 > 0 ? -1 : 1) }}
      angle={d1 > 0 ? UP : DOWN}
      length={10}
      color={DIMENSION_COLORS[Dimension.D1] || '#888888'}
    />)}
  </g>
}

export default PitchGridDot
