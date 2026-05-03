import React, { useState } from 'react'

import PitchGridDot from '@/components/grid/PitchGridDot'

import PitchGridContext from '@/context/PitchGridContext'
import { useKey } from '@/hooks/useKey'

import { defaultDimensionRanges } from '@/utils/dimension'
import { moveInLimit } from '@/utils/math'

import {
  AxisUnitSpacing,
  D1, D2, D3, D4, D5, D6,
  Dimension,
} from '@/types/Dimension'
import Position from '@/types/Position'
import Range from '@/types/Range'


type PitchGridProps = {
  center: Position
  spacing: AxisUnitSpacing[]
  dimensionRanges?: Record<Dimension, Range>
  triggerKeys?: string[][]
}

const PitchGrid: React.FC<PitchGridProps> = ({
  center,
  spacing,
  dimensionRanges = defaultDimensionRanges,
  triggerKeys = [],
}) => {
  const oAxis = D1
  const xAxis = D2
  const yAxis = D3
  const [zAxis, setZAxis] = useState(D4)

  const oRange = dimensionRanges[oAxis]
  const xRange = dimensionRanges[xAxis]
  const yRange = dimensionRanges[yAxis]
  const zRange = dimensionRanges[zAxis]

  const [oShift, setOShift] = useState(0)

  const xs: number[] = Array.from(
    { length: xRange.end - xRange.start + 1 },
    (_, i) => i + xRange.start,
  )
  const ys: number[] = Array.from(
    { length: yRange.end - yRange.start + 1 },
    (_, i) => i + yRange.start,
  )
  const zs: number[] = Array.from(
    { length: zRange.end - zRange.start + 1 },
    (_, i) => i + zRange.start,
  )


  const dots = xs.flatMap(((x, xi) => ys.flatMap((y, yi) => zs.map(z => {
    const scale = spacing.reduce(
      (acc, s) => s.z > 0
        ? acc * Math.pow(1 + s.z, z)
        : acc / Math.pow(1 + s.z, z),
      1,
    )
    const dotX = center.x + x * (spacing[0].x + spacing[1].x) + spacing[2].x * (scale - 1)
    const dotY = center.y + y * (spacing[0].y + spacing[1].y) + spacing[2].y * (scale - 1)

    return {
      [D1]: oShift,
      [D2]: x,
      [D3]: y,
      [D4]: zAxis === D4 ? z : 0,
      [D5]: zAxis === D5 ? z : 0,
      [D6]: zAxis === D6 ? z : 0,
      x: dotX,
      y: dotY,
      scale,
      triggerKey: z ? null : triggerKeys[yi]?.[xi],
    }
  }))))

  useKey('PageUp', () => setOShift(moveInLimit(oShift, 1, oRange)))
  useKey('PageDown', () => setOShift(moveInLimit(oShift, -1, oRange)))
  useKey('Tab', () => {
    const zAxes = [D4, D5, D6]
    const currentIndex = zAxes.indexOf(zAxis)
    const nextIndex = (currentIndex + 1) % zAxes.length
    setZAxis(zAxes[nextIndex])
  })

  return <PitchGridContext.Provider value={{ center, spacing }}>
    <g>
      {dots.map(dot =>
        <PitchGridDot
          key={`${dot[D1]},${dot[D2]},${dot[D3]},${dot[D4]},${dot[D5]},${dot[D6]}`}
          position={{ x: dot.x, y: dot.y }}
          scale={dot.scale}
          dimensionUnits={dot}
          triggerKey={dot.triggerKey}
        />,
      )}
    </g>
  </PitchGridContext.Provider>
}

export default PitchGrid
export { PitchGridContext }
