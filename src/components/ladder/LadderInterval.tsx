import React, { useContext } from 'react'

import PitchLadderContext from '@/context/PitchLadderContext'
import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

import {
  getAngle,
  getPointByRadiusAndAngle,
  getPositionOnLineSegment,
  getVerticalEndpoints,
  mapRange,
} from '@/utils/math'
import { OVERTONES_COLORS } from '@/utils/overtones'

interface LadderIntervalProps {
  lowPitch: number
  hiPitch: number
  dimension: number
  reverse?: boolean
}

const LadderInterval: React.FC<LadderIntervalProps> = ({
  lowPitch,
  hiPitch,
  dimension,
  reverse = false,
}) => {
  const { startPitch, endPitch } = useContext(PitchVisualizeSystemContext)
  const { startPoint, endPoint, width } = React.useContext(PitchLadderContext)
  const strokeWidth = 2
  const length = width * 1.2
  const stripeWidth = 25

  const lowRatio = mapRange([startPitch, endPitch], [0, 1], lowPitch)
  const hiRatio = mapRange([startPitch, endPitch], [0, 1], hiPitch)
  const lowPoint = getPositionOnLineSegment([startPoint, endPoint], lowRatio)
  const hiPoint = getPositionOnLineSegment([startPoint, endPoint], hiRatio)
  const angle = getAngle(startPoint, endPoint)

  const hiEndPoints = getVerticalEndpoints(hiPoint, length, angle)
    .map(p => getPointByRadiusAndAngle(p, strokeWidth / 2, angle))
  const lowEndPoints = getVerticalEndpoints(lowPoint, length, angle)
    .map(p => getPointByRadiusAndAngle(p, strokeWidth / 2, -angle))
  const hiInnerPoints = getVerticalEndpoints(hiPoint, length - stripeWidth, angle)
    .map(p => getPointByRadiusAndAngle(p, strokeWidth / 2, angle))
  const hiD5Point = getPointByRadiusAndAngle(
    getVerticalEndpoints(hiPoint, length - stripeWidth * 2, angle)[1],
    strokeWidth / 2, angle,
  )
  const hiD5InnerPoint = getPointByRadiusAndAngle(
    getVerticalEndpoints(hiPoint, length - stripeWidth * 3, angle)[1],
    strokeWidth / 2, angle,
  )
  const lowInnerPoints = getVerticalEndpoints(lowPoint, length - stripeWidth, angle)
    .map(p => getPointByRadiusAndAngle(p, strokeWidth / 2, -angle))
  const midEndPoints = [
    getPointByRadiusAndAngle(lowPoint, 10, angle),
    getPointByRadiusAndAngle(hiPoint, 10, -angle),
  ]

  const d1 = {
    x1: midEndPoints[0].x,
    y1: midEndPoints[0].y,
    x2: midEndPoints[1].x,
    y2: midEndPoints[1].y,
  }

  const d2 = [
    lowEndPoints[1],
    lowInnerPoints[1],
    hiInnerPoints[1],
    hiEndPoints[1],
  ].map(p => `${p.x},${p.y}`).join(' ')

  const d3 = [
    lowEndPoints[0],
    lowInnerPoints[0],
    hiInnerPoints[0],
    hiEndPoints[0],
  ].map(p => `${p.x},${p.y}`).join(' ')

  const d4 = [
    lowEndPoints[1],
    lowInnerPoints[1],
    hiEndPoints[0],
    hiInnerPoints[0],
  ].map(p => `${p.x},${p.y}`).join(' ')

  const d5 = [
    lowEndPoints[0],
    lowInnerPoints[0],
    hiD5Point,
    hiD5InnerPoint,
  ].map(p => `${p.x},${p.y}`).join(' ')

  const notation = {
    1: <line {...d1} stroke={OVERTONES_COLORS[0]} />,
    2: <polygon points={d2} fill={OVERTONES_COLORS[1]} opacity={reverse ? 0.25 : 1} />,
    3: <polygon points={d3} fill={OVERTONES_COLORS[2]} opacity={reverse ? 0.25 : 1} />,
    4: <polygon points={d4} fill={OVERTONES_COLORS[3]} opacity={reverse ? 0.25 : 1} />,
    5: <polygon points={d5} fill={OVERTONES_COLORS[4]} opacity={reverse ? 0.25 : 1} />,
    6: <polygon points={d5} fill={OVERTONES_COLORS[5]} opacity={reverse ? 0.25 : 1} />,
  }[dimension] || null

  return notation
}

export default LadderInterval
