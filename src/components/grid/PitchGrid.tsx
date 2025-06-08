import React, { useState } from 'react'

import PitchGridDot from '@/components/grid/PitchGridDot'

import PitchGridContext from '@/context/PitchGridContext'

import { useKey } from '@/hooks/useKey'

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
  const dn = 1

  const xAxis = axis[2]
  const yAxis = axis[1]

  const xs = Array.from(
    { length: xAxis.end - xAxis.start + 1 },
    (_, i) => i + xAxis.start,
  )
  const ys = Array.from(
    { length: yAxis.end - yAxis.start + 1 },
    (_, i) => i + yAxis.start,
  )
  const dots = xs.flatMap((x, xi) => ys.map((y, yi) => ({
    d2: y,
    d3: x,
    x: center.x + x * spacing.x,
    y: center.y + y * spacing.y,
    triggerKey: triggerKeys[yi]?.[xi],
  })))

  useKey(
    'Tab',
    () => setD(d => (d === null ? 4 : d === 6 ? null : d + 1)),
  )

  return <PitchGridContext.Provider value={{ center, spacing, axis }}>
    <g>
      {dots.map(dot =>
        <PitchGridDot
          key={`${dot.d2},${dot.d3},${d}`}
          position={{ x: dot.x, y: dot.y }}
          d1={1}
          d2={dot.d2}
          d3={dot.d3}
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
