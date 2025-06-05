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
  { x: x1, y: y1 }: { x: number, y: number },
  { x: x2, y: y2 }: { x: number, y: number },
): number => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))

export const projectPointOnLine = (
  point: { x: number, y: number },
  lineStart: { x: number, y: number },
  lineEnd: { x: number, y: number },
): { x: number, y: number } => {
  const lineVector = { x: lineEnd.x - lineStart.x, y: lineEnd.y - lineStart.y }
  const pointVector = { x: point.x - lineStart.x, y: point.y - lineStart.y }
  const lineLengthSquared = lineVector.x * lineVector.x + lineVector.y * lineVector.y
  if (lineLengthSquared === 0) return { ...lineStart }

  const t = (pointVector.x * lineVector.x + pointVector.y * lineVector.y) / lineLengthSquared
  return {
    x: lineStart.x + t * lineVector.x,
    y: lineStart.y + t * lineVector.y,
  }
}
