import React, { useState } from 'react'

import PitchGridDot from '@/components/grid/PitchGridDot'

import PitchGridContext from '@/context/PitchGridContext'
import { useKey } from '@/hooks/useKey'

import { defaultDimensionRanges } from '@/utils/dimension'
import { moveInLimit } from '@/utils/math'

import { Dimension, DimensionRange } from '@/types/Dimension'
import Position from '@/types/Position'


type PitchGridProps = {
  center: Position
  spacing: Position
  dimensionRanges?: Record<Dimension, DimensionRange>
  triggerKeys?: string[][]
}

const PitchGrid: React.FC<PitchGridProps> = ({
  center,
  spacing,
  dimensionRanges = defaultDimensionRanges,
  triggerKeys = [],
}) => {
  const [d, setD] = useState<number | null>(null)
  const [dnShift, setDnShift] = useState<number>(0)

  const [d1Shift, setD1Shift] = useState<number>(0)
  const [d2Shift, setD2Shift] = useState<number>(0)
  const [d3Shift, setD3Shift] = useState<number>(0)

  const oAxis = dimensionRanges[Dimension.D1]
  const xAxis = dimensionRanges[Dimension.D2]
  const yAxis = dimensionRanges[Dimension.D3]

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

  /* eslint-disable @stylistic/max-len */
  useKey('PageUp', () => setD1Shift(moveInLimit(d1Shift, 1, [oAxis.shift.start, oAxis.shift.end])))
  useKey('PageDown', () => setD1Shift(moveInLimit(d1Shift, -1, [oAxis.shift.start, oAxis.shift.end])))
  useKey('ArrowUp', () => setD2Shift(moveInLimit(d2Shift, 1, [xAxis.shift.start, xAxis.shift.end])))
  useKey('ArrowDown', () => setD2Shift(moveInLimit(d2Shift, -1, [xAxis.shift.start, xAxis.shift.end])))
  useKey('ArrowRight', () => setD3Shift(moveInLimit(d3Shift, 1, [yAxis.shift.start, yAxis.shift.end])))
  useKey('ArrowLeft', () => setD3Shift(moveInLimit(d3Shift, -1, [yAxis.shift.start, yAxis.shift.end])))
  useKey('9', () => { setD(4); setDnShift(-1) }, () => { setD(null); setDnShift(0) })
  useKey('-', () => { setD(5); setDnShift(-1) }, () => { setD(null); setDnShift(0) })
  useKey('[', () => { setD(6); setDnShift(-1) }, () => { setD(null); setDnShift(0) })
  useKey('0', () => { setD(4); setDnShift(1) }, () => { setD(null); setDnShift(0) })
  useKey('=', () => { setD(5); setDnShift(1) }, () => { setD(null); setDnShift(0) })
  useKey(']', () => { setD(6); setDnShift(1) }, () => { setD(null); setDnShift(0) })
  /* eslint-enable @stylistic/max-len */

  return <PitchGridContext.Provider value={{ center, spacing }}>
    <g>
      {dots.map(dot =>
        <PitchGridDot
          key={`${d1Shift},${dot.d2 + d2Shift},${dot.d3 + d3Shift}${d ? `,${d}:${dnShift}` : ''}`}
          position={{ x: dot.x, y: dot.y }}
          dimensionUnits={{
            [Dimension.D1]: d1Shift,
            [Dimension.D2]: dot.d2 + d2Shift,
            [Dimension.D3]: dot.d3 + d3Shift,
            [Dimension.D4]: d === 4 ? dnShift : 0,
            [Dimension.D5]: d === 5 ? dnShift : 0,
            [Dimension.D6]: d === 6 ? dnShift : 0,
          }}
          triggerKey={dot.triggerKey}
        />,
      )}
    </g>
  </PitchGridContext.Provider>
}

export default PitchGrid
export { PitchGridContext }
