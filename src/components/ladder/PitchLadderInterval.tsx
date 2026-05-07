import React, { useContext } from 'react'

import PitchLadderContext from '@/context/PitchLadderContext'
import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

import Arrow from '@/components/Arrow'

import { DIMENSION_COLORS } from '@/utils/dimension'
import {
  getAngle,
  getPointByRadiusAndAngle,
  getPositionOnLineSegment,
  getVerticalEndpoints,
  mapRange,
  R_180,
  R_90,
} from '@/utils/math'

import { D1, D2, D3, D4, D5, D6, Dimension } from '@/types/Dimension'

const INTERVAL_WIDTH = 16

export type PitchLadderIntervalProps = {
  startPitch: number
  endPitch: number
  dimension: Dimension
}

const PitchLadderInterval: React.FC<PitchLadderIntervalProps> = ({
  startPitch: intervalStartPitch,
  endPitch: intervalEndPitch,
  dimension,
}) => {
  const { startPitch, endPitch } = useContext(PitchVisualizeSystemContext)
  const { startPoint, endPoint, width } = React.useContext(PitchLadderContext)

  const intervalStartPoint = getPositionOnLineSegment(
    [startPoint, endPoint],
    mapRange([startPitch, endPitch], [0, 1], intervalStartPitch),
  )
  const intervalEndPoint = getPositionOnLineSegment(
    [startPoint, endPoint],
    mapRange([startPitch, endPitch], [0, 1], intervalEndPitch),
  )
  const angle = getAngle(startPoint, endPoint)

  const direction = intervalEndPitch > intervalStartPitch ? 'up' : 'down'

  if (dimension === D1) {
    const GAP = 4
    const arrowStartPoint = getPointByRadiusAndAngle(
      intervalStartPoint,
      GAP,
      direction === 'up' ? angle : angle + R_180,
    )
    const arrowEndPoint = getPointByRadiusAndAngle(
      intervalEndPoint,
      GAP,
      direction === 'up' ? angle + R_180 : angle,
    )
    return <g>
      <line
        x1={arrowStartPoint.x}
        y1={arrowStartPoint.y}
        x2={arrowEndPoint.x}
        y2={arrowEndPoint.y}
        stroke="white"
        strokeWidth={2}
      />
      <Arrow
        c={arrowEndPoint}
        spreadAngle={R_90}
        length={6}
        angle={direction === 'up' ? angle : angle + R_180}
      />
    </g>
  }

  const [
    startRightOutCorner,
    startLeftOutCorner,
  ] = getVerticalEndpoints(intervalStartPoint, width, angle)
  const [
    startRightInCorner,
    startLeftInCorner,
  ] = getVerticalEndpoints(intervalStartPoint, width - INTERVAL_WIDTH * 2, angle)
  const [
    endRightOutCorner,
    endLeftOutCorner,
  ] = getVerticalEndpoints(intervalEndPoint, width, angle)
  const [
    endRightInCorner,
    endLeftInCorner,
  ] = getVerticalEndpoints(intervalEndPoint, width - INTERVAL_WIDTH * 2, angle)

  switch (dimension) {
    case D2:
      return <g>
        <path
          d={`M ${startLeftOutCorner.x} ${startLeftOutCorner.y}
              L ${startLeftInCorner.x} ${startLeftInCorner.y}
              L ${endLeftInCorner.x} ${endLeftInCorner.y}
              L ${endLeftOutCorner.x} ${endLeftOutCorner.y}
              Z`}
          fill={DIMENSION_COLORS[D2]}
        />
      </g>
    case D3:
      return <g>
        <path
          d={`M ${startRightOutCorner.x} ${startRightOutCorner.y}
              L ${startRightInCorner.x} ${startRightInCorner.y}
              L ${endRightInCorner.x} ${endRightInCorner.y}
              L ${endRightOutCorner.x} ${endRightOutCorner.y}
              Z`}
          fill={DIMENSION_COLORS[D3]}
        />
      </g>
    case D4:
      return <g>
        <path
          d={`M ${startLeftOutCorner.x} ${startLeftOutCorner.y}
              L ${startLeftInCorner.x} ${startLeftInCorner.y}
              L ${endRightOutCorner.x} ${endRightOutCorner.y}
              L ${endRightInCorner.x} ${endRightInCorner.y}
              Z`}
          fill={DIMENSION_COLORS[D4]}
        />
      </g>
    case D5:
      return <g>
        <path
          d={`M ${startRightOutCorner.x} ${startRightOutCorner.y}
              L ${startRightInCorner.x} ${startRightInCorner.y}
              L ${endLeftOutCorner.x} ${endLeftOutCorner.y}
              L ${endLeftInCorner.x} ${endLeftInCorner.y}
              Z`}
          fill={DIMENSION_COLORS[D5]}
        />
      </g>
    case D6:
      return <g>
        <path
          d={`M ${startRightOutCorner.x} ${startRightOutCorner.y}
              L ${startRightInCorner.x} ${startRightInCorner.y}
              L ${endLeftOutCorner.x} ${endLeftOutCorner.y}
              L ${endLeftInCorner.x} ${endLeftInCorner.y}
              Z`}
          fill={DIMENSION_COLORS[D6]}
        />
      </g>
    default:
      return <g></g>
  }
}

export default PitchLadderInterval
