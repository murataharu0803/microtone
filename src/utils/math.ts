import { R_90 } from '@/types/constants'
import Position from '@/types/Position'

export const findClosest = <T>(
  arr: T[],
  distFn: (item: T) => number,
): T => {
  let closest = arr[0]
  let closestDiff = Math.abs(distFn(closest))
  for (const item of arr) {
    const diff = Math.abs(distFn(item))
    if (diff < closestDiff) {
      closest = item
      closestDiff = diff
    }
  }

  return closest
}

export const findFurthest = <T>(
  arr: T[],
  distFn: (item: T) => number,
): T => {
  let closest = arr[0]
  let closestDiff = Math.abs(distFn(closest))
  for (const item of arr) {
    const diff = Math.abs(distFn(item))
    if (diff > closestDiff) {
      closest = item
      closestDiff = diff
    }
  }

  return closest
}

export const distance = (
  { x: x1, y: y1 }: Position,
  { x: x2, y: y2 }: Position,
): number => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))

export const projectPointOnLine = (
  point: Position,
  line: [Position, Position],
): Position => {
  const [start, end] = line
  const lineVector = { x: end.x - start.x, y: end.y - start.y }
  const pointVector = { x: point.x - start.x, y: point.y - start.y }
  const lineLengthSquared = lineVector.x * lineVector.x + lineVector.y * lineVector.y
  if (lineLengthSquared === 0) return { ...start }

  const t = (pointVector.x * lineVector.x + pointVector.y * lineVector.y) / lineLengthSquared
  return {
    x: start.x + t * lineVector.x,
    y: start.y + t * lineVector.y,
  }
}

export const getAngle = (a: Position, b: Position): number => {
  const deltaX = b.x - a.x
  const deltaY = b.y - a.y
  return Math.atan2(deltaY, deltaX)
}

export const mapRange = (
  inRange: [number, number],
  outRange: [number, number],
  value: number,
) => {
  const [inMin, inMax] = inRange
  const [outMin, outMax] = outRange
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin)
}

export const getRatioOnLineSegment = (
  point: Position,
  line: [Position, Position],
): number => {
  const [start, end] = line
  const perpendicularPoint = projectPointOnLine(point, line)
  const lineLength = distance(start, end)
  const startToPoint = distance(start, perpendicularPoint)
  const endToPoint = distance(end, perpendicularPoint)
  return startToPoint / (startToPoint + endToPoint) * lineLength
}

export const getPositionOnLineSegment = (
  line: [Position, Position],
  ratio: number,
): Position => {
  const [start, end] = line
  return {
    x: start.x + ratio * (end.x - start.x),
    y: start.y + ratio * (end.y - start.y),
  }
}

export const getVerticalEndpoints = (
  center: Position,
  radius: number,
  angle: number,
): [Position, Position] => [
  {
    x: center.x + radius * Math.cos(angle + R_90),
    y: center.y + radius * Math.sin(angle + R_90),
  },
  {
    x: center.x + radius * Math.cos(angle - R_90),
    y: center.y + radius * Math.sin(angle - R_90),
  },
]
