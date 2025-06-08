import React, { useContext, useRef, useState } from 'react'

import { PitchGridContext } from '@/components/grid/PitchGrid'

import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

import { useKey } from '@/hooks/useKey'
import { useMouse } from '@/hooks/useMouse'

import { OVERTONES_COLORS, PRIMES } from '@/utils/overtones'
import { getHalfSectorPath, getRingPath } from '@/utils/sector'

import Position from '@/types/Position'
import { LEFT, R_180, RIGHT } from '@/types/constants'

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

const PitchGridDot: React.FC<PitchGridDotProps> = ({ position, d1, d2, d3, d, dn, triggerKey }) => {
  const {
    baseFrequency,
    startPitch,
    endPitch,
    playNote,
    stopNote,
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
  const mouseNoteState = useState<string | null>(null)
  const keyNoteState = useState<string | null>(null)

  const play = (state: typeof mouseNoteState) => {
    const [value, setValue] = state
    if (value) setValue(playNote(frequency, value))
    else setValue(playNote(frequency))
  }

  const stop = (state: typeof mouseNoteState) => {
    const [value, setValue] = state
    if (value) {
      stopNote(value)
      setValue(null)
    }
  }

  const mouseStartPlaying = () => play(mouseNoteState)
  const mouseStopPlaying = () => stop(mouseNoteState)
  const keyStartPlaying = () => play(keyNoteState)
  const keyStopPlaying = () => stop(keyNoteState)

  useMouse(buttonRef, mouseStartPlaying, mouseStopPlaying)
  useKey(triggerKey || '', keyStartPlaying, keyStopPlaying)

  return <g ref={buttonRef} style={{ opacity: inRange ? 1 : 0.25 }}>
    <circle
      cx={position.x}
      cy={position.y}
      r={30}
      fill={(mouseNoteState[0] || keyNoteState[0]) ? '#888888' : 'transparent'}
    />
    {dividedRing(`d2-${d2}-d3-${d3}`, position, 'out', d2, OVERTONES_COLORS[1] || '#888888')}
    {dividedRing(`d2-${d2}-d3-${d3}`, position, 'mid', d3, OVERTONES_COLORS[2] || '#888888')}
    {d && dn &&
      dividedRing(`d2-${d2}-d3-${d3}`, position, 'in', dn, OVERTONES_COLORS[d - 1] || '#888888')
    }
  </g>
}

export default PitchGridDot
