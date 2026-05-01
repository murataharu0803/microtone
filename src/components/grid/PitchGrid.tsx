import React, { useState } from 'react'

import PitchGridDot from '@/components/grid/PitchGridDot'

import PitchGridContext from '@/context/PitchGridContext'

import { useKey } from '@/hooks/useKey'

import { moveInLimit } from '@/utils/math'

import Axis, { defaultAxis } from '@/types/Axis'
import Position from '@/types/Position'

type PitchGridProps = {
  center: Position
  spacing: Position
  axis?: Axis[]
  triggerKeys?: string[][]
}

const PitchGrid: React.FC<PitchGridProps> = ({
  center,
  spacing,
  axis = defaultAxis,
  triggerKeys = [],
}) => {
  const [d, setD] = useState<number | null>(null)
  const [dn, setDn] = useState<number>(0)

  const [d1, setD1] = useState<number>(0)
  const [d2, setD2] = useState<number>(0)
  const [d3, setD3] = useState<number>(0)

  const xAxis = axis[1]
  const yAxis = axis[2]

  const xs = Array.from(
    { length: xAxis.display.end - xAxis.display.start + 1 },
    (_, i) => i + xAxis.display.start,
  )
  const ys = Array.from(
    { length: yAxis.display.end - yAxis.display.start + 1 },
    (_, i) => i + yAxis.display.start,
  )
  const dots = xs.flatMap((x, xi) => ys.map((y, yi) => ({
    d2: x,
    d3: y,
    x: center.x + x * spacing.x,
    y: center.y + y * spacing.y,
    triggerKey: triggerKeys[yi]?.[xi],
  })))

  useKey('PageUp', () => setD1(moveInLimit(d1, 1, [axis[0].shift.start, axis[0].shift.end])))
  useKey('PageDown', () => setD1(moveInLimit(d1, -1, [axis[0].shift.start, axis[0].shift.end])))
  useKey('ArrowUp', () => setD2(moveInLimit(d2, 1, [axis[1].shift.start, axis[1].shift.end])))
  useKey('ArrowDown', () => setD2(moveInLimit(d2, -1, [axis[1].shift.start, axis[1].shift.end])))
  useKey('ArrowRight', () => setD3(moveInLimit(d3, 1, [axis[2].shift.start, axis[2].shift.end])))
  useKey('ArrowLeft', () => setD3(moveInLimit(d3, -1, [axis[2].shift.start, axis[2].shift.end])))
  useKey('9', () => { setD(4); setDn(-1) }, () => { setD(null); setDn(0) })
  useKey('-', () => { setD(5); setDn(-1) }, () => { setD(null); setDn(0) })
  useKey('[', () => { setD(6); setDn(-1) }, () => { setD(null); setDn(0) })
  useKey('0', () => { setD(4); setDn(1) }, () => { setD(null); setDn(0) })
  useKey('=', () => { setD(5); setDn(1) }, () => { setD(null); setDn(0) })
  useKey(']', () => { setD(6); setDn(1) }, () => { setD(null); setDn(0) })

  return <PitchGridContext.Provider value={{ center, spacing, axis }}>
    <g>
      {dots.map(dot =>
        <PitchGridDot
          key={`${d1},${dot.d2 + d2},${dot.d3 + d3}${d ? `,${d}:${dn}` : ''}`}
          position={{ x: dot.x, y: dot.y }}
          d1={d1}
          d2={dot.d2 + d2}
          d3={dot.d3 + d3}
          d={d}
          dn={dn}
          triggerKey={dot.triggerKey}
        />,
      )}
    </g>
  </PitchGridContext.Provider>
}

export default PitchGrid
export { PitchGridContext }
