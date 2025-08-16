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

export const getPointByRadiusAndAngle = (
  center: Position,
  radius: number,
  angle: number,
): Position => ({
  x: center.x + radius * Math.cos(angle),
  y: center.y + radius * Math.sin(angle),
})

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

export const getDistanceToLine = (
  point: Position,
  line: [Position, Position],
): number => {
  const perpendicularPoint = projectPointOnLine(point, line)
  return distance(point, perpendicularPoint)
}

export const getRatioOnLineSegment = (
  point: Position,
  line: [Position, Position],
): number => {
  const [start, end] = line
  const perpendicularPoint = projectPointOnLine(point, line)
  const vector = { x: end.x - start.x, y: end.y - start.y }
  const pointVector = { x: perpendicularPoint.x - start.x, y: perpendicularPoint.y - start.y }
  const ratio = Math.abs(vector.x) > Math.abs(vector.y)
    ? pointVector.x / vector.x
    : pointVector.y / vector.y
  return ratio
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
  width: number,
  angle: number,
): [Position, Position] => [
  {
    x: center.x + width / 2 * Math.cos(angle + R_90),
    y: center.y + width / 2 * Math.sin(angle + R_90),
  },
  {
    x: center.x + width / 2 * Math.cos(angle - R_90),
    y: center.y + width / 2 * Math.sin(angle - R_90),
  },
]

export const moveInLimit = (
  value: number,
  delta: number,
  limit: [number, number],
): number => {
  const [min, max] = limit
  const newValue = value + delta
  return Math.max(min, Math.min(max, newValue))
}

export const uniqueArray = <T>(arr: T[], eq: (a: T, b: T) => boolean): T[] => {
  const unique: T[] = []
  for (const item of arr) if (!unique.some(u => eq(u, item))) unique.push(item)
  return unique
}
