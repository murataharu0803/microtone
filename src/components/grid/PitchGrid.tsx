import React, { useState } from 'react'

import PitchGridDot from '@/components/grid/PitchGridDot'

import PitchGridContext from '@/context/PitchGridContext'
import { useKey } from '@/hooks/useKey'

import { defaultDimensionRanges } from '@/utils/dimension'
import { moveInLimit } from '@/utils/math'

import { D1, D2, D3, D4, D5, D6, Dimension, DimensionRange } from '@/types/Dimension'
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
  const [dimensionShifts, setDimensionShifts] =  useState({
    [D1]: 0,
    [D2]: 0,
    [D3]: 0,
    activeLargeDimension: null as Dimension | null,
    activeLargeDimensionShift: 0,
  })

  const shiftSmallDimension = (dimension: typeof D1 | typeof D2 | typeof D3, delta: number) => {
    const range = [
      dimensionRanges[dimension].shift.start,
      dimensionRanges[dimension].shift.end,
    ] as [number, number]

    setDimensionShifts(prev => ({
      ...prev,
      [dimension]: moveInLimit(prev[dimension], delta, range),
    }))
  }

  const shiftLargeDimension = (dimension: Dimension, target: number) => {
    if (target === 0) {
      setDimensionShifts(prev => ({
        ...prev,
        activeLargeDimension: null,
        activeLargeDimensionShift: 0,
      }))
    } else {
      const range = [
        dimensionRanges[dimension].shift.start,
        dimensionRanges[dimension].shift.end,
      ] as [number, number]

      setDimensionShifts(prev => ({
        ...prev,
        activeLargeDimension: dimension,
        activeLargeDimensionShift: moveInLimit(target, 0, range),
      }))
    }
  }

  const xAxis = dimensionRanges[D2]
  const yAxis = dimensionRanges[D3]

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

  useKey('PageUp', () => shiftSmallDimension(D1, 1))
  useKey('PageDown', () => shiftSmallDimension(D1, -1))
  useKey('ArrowUp', () => shiftSmallDimension(D2, 1))
  useKey('ArrowDown', () => shiftSmallDimension(D2, -1))
  useKey('ArrowRight', () => shiftSmallDimension(D3, 1))
  useKey('ArrowLeft', () => shiftSmallDimension(D3, -1))
  useKey('9', () => shiftLargeDimension(D4, -1), () => shiftLargeDimension(D4, 0))
  useKey('0', () => shiftLargeDimension(D4,  1), () => shiftLargeDimension(D4, 0))
  useKey('-', () => shiftLargeDimension(D5, -1), () => shiftLargeDimension(D5, 0))
  useKey('=', () => shiftLargeDimension(D5,  1), () => shiftLargeDimension(D5, 0))
  useKey('[', () => shiftLargeDimension(D6, -1), () => shiftLargeDimension(D6, 0))
  useKey(']', () => shiftLargeDimension(D6,  1), () => shiftLargeDimension(D6, 0))

  const {
    activeLargeDimension: d,
    activeLargeDimensionShift: dnShift,
    [D1]: d1Shift,
    [D2]: d2Shift,
    [D3]: d3Shift,
  } = dimensionShifts

  return <PitchGridContext.Provider value={{ center, spacing }}>
    <g>
      {dots.map(dot =>
        <PitchGridDot
          key={`${d1Shift},${dot.d2 + d2Shift},${dot.d3 + d3Shift}${d ? `,${d}:${dnShift}` : ''}`}
          position={{ x: dot.x, y: dot.y }}
          dimensionUnits={{
            [D1]: d1Shift,
            [D2]: dot.d2 + d2Shift,
            [D3]: dot.d3 + d3Shift,
            [D4]: d === D4 ? dnShift : 0,
            [D5]: d === D5 ? dnShift : 0,
            [D6]: d === D6 ? dnShift : 0,
          }}
          triggerKey={dot.triggerKey}
        />,
      )}
    </g>
  </PitchGridContext.Provider>
}

export default PitchGrid
export { PitchGridContext }
