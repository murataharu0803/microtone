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
