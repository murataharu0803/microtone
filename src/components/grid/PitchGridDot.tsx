import React, { useContext, useRef } from 'react'

import Arrow from '@/components/Arrow'

import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'
import { useNote } from '@/hooks/useNote'

import { ALL_DIMENSIONS, DIMENSION_COLORS, DIMENSION_FACTOR } from '@/utils/dimension'
import { getPointByRadiusAndAngle } from '@/utils/math'
import { getHalfSectorPath, getRingPath } from '@/utils/sector'

import { D1, D2, D3, Dimension } from '@/types/Dimension'
import JINote from '@/types/JINote'
import Position from '@/types/Position'
import { DOWN, R_180, R_90, UP } from '@/utils/math'

const ZERO_COLOR = '#444444'
const GAP = 3

const sectorGapMask = (
  id: string,
  center: Position,
  radius: number,
  angles: number[],
  scale: number,
) => <mask id={id}>
  <rect width="100%" height="100%" fill="white" />
  {angles.map(angle => <line
    key={`${id}-${angle}`}
    x1={center.x}
    y1={center.y}
    x2={center.x + radius * Math.cos(angle)}
    y2={center.y + radius * Math.sin(angle)}
    stroke="black"
    strokeWidth={GAP * scale}
  />)}
</mask>

const dividedRing = (
  id: string,
  center: Position,
  pos: 'out' | 'mid' | 'in',
  d: number,
  color: string,
  dir: number,
  scale: number,
) => {
  const outRadius = (pos === 'out' ? 18 : pos === 'mid' ? 12 : 6) * scale
  const width = 3 * scale
  const innerRadius = (pos === 'in' ? 0 : outRadius - width)
  const radius = {
    inner: innerRadius,
    outer: outRadius,
  }

  if (d === 0 && pos === 'out') {
    return <path
      fillRule='evenodd'
      d={getRingPath(center, radius)}
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
      {sectorGapMask(`sector-gap-mask-${id}-${pos}`, center, outRadius, angles, scale)}
    </defs>}
    <g mask={`url(#sector-gap-mask-${id}-${pos})`}>
      <path
        d={getHalfSectorPath(center, radius, d > 0 ? dir : dir + R_180)}
        fill={color}
      />
      {pos === 'out' && <path
        d={getHalfSectorPath(center, radius, d > 0 ? dir + R_180 : dir)}
        fill={ZERO_COLOR}
      />}
    </g>
  </g>
}

interface PitchGridDotProps {
  position: Position
  dimensionUnits: Record<Dimension, number>
  scale: number
  triggerKey: string | null
}

const PitchGridDot: React.FC<PitchGridDotProps> = ({
  position,
  dimensionUnits,
  scale,
  triggerKey,
}) => {
  const {
    baseFrequency,
    startPitch,
    endPitch,
  } = useContext(PitchVisualizeSystemContext)

  const factor = ALL_DIMENSIONS.reduce((acc, dim) => {
    const unit = dimensionUnits[dim as Dimension] || 0
    return acc * Math.pow(DIMENSION_FACTOR[dim], unit)
  }, 1)
  const frequency = baseFrequency * factor
  const pitch = Math.log2(factor)
  const inRange = pitch >= startPitch && pitch <= endPitch

  const buttonRef = useRef<SVGGElement>(null)
  const jiNote = new JINote(dimensionUnits, baseFrequency)
  const { active } = useNote(frequency, buttonRef, triggerKey, jiNote)

  const d1 = dimensionUnits[D1] || 0
  const d2 = dimensionUnits[D2] || 0
  const d3 = dimensionUnits[D3] || 0

  const largeDimensions = ALL_DIMENSIONS.slice(3)
  const d = Object.entries(dimensionUnits).find(([dim, unit]) => {
    const dimension = dim as Dimension
    return largeDimensions.includes(dimension) && unit !== 0
  })?.[0] as Dimension || null
  const dn = dimensionUnits[d] || null

  const opacity = (inRange ? 1 : 0.25) * (1 - (Math.abs(Math.log(scale))) * 2)

  const { x, y } = getPointByRadiusAndAngle(position, 34 * scale, d1 > 0 ? UP : DOWN)

  return <g ref={buttonRef} style={{ opacity }}>
    <circle
      cx={position.x}
      cy={position.y}
      r={18 * scale}
      fill={active ? '#444444' : 'transparent'}
    />
    {dividedRing(
      `d2-${d2}-d3-${d3}-dn-${dn}`,
      position,
      'out',
      d2,
      DIMENSION_COLORS[D2] || '#888888',
      0,
      scale,
    )}
    {dividedRing(
      `d2-${d2}-d3-${d3}-dn-${dn}`,
      position,
      'mid',
      d3,
      DIMENSION_COLORS[D3] || '#888888',
      -R_90,
      scale,
    )}
    {d && dn && dividedRing(
      `d2-${d2}-d3-${d3}-dn-${dn}`,
      position,
      'in',
      dn,
      DIMENSION_COLORS[d] || '#888888',
      - R_90 / 2,
      scale,
    )}
    {Array.from({ length: Math.abs(d1) }, (_, i) => <Arrow
      key={i}
      c={{ x, y: y + 5 * i * (d1 > 0 ? -1 : 1) }}
      angle={d1 > 0 ? UP : DOWN}
      length={10}
      color={DIMENSION_COLORS[D1] || '#888888'}
    />)}
  </g>
}

export default PitchGridDot
