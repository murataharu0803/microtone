import { R_180, R_360, R_90 } from '@/types/constants'
import Position from '@/types/Position'

export const getSectorPath = (
  center: Position,
  radius: {
    inner: number
    outer: number
  },
  angle: {
    start: number
    end: number
  },
) => {
  const a0 = angle.start
  const a1 = angle.end
  const cx = center.x
  const cy = center.y

  const x0 = cx + radius.outer * Math.cos(a0)
  const y0 = cy + radius.outer * Math.sin(a0)
  const x1 = cx + radius.outer * Math.cos(a1)
  const y1 = cy + radius.outer * Math.sin(a1)

  const x2 = cx + radius.inner * Math.cos(a1)
  const y2 = cy + radius.inner * Math.sin(a1)
  const x3 = cx + radius.inner * Math.cos(a0)
  const y3 = cy + radius.inner * Math.sin(a0)

  const largeArc = (a1 - a0) % (R_360) > R_180 ? 1 : 0

  return [
    `M ${x0} ${y0}`,
    `A ${radius.outer} ${radius.outer} 0 ${largeArc} 1 ${x1} ${y1}`,
    `L ${x2} ${y2}`,
    `A ${radius.inner} ${radius.inner} 0 ${largeArc} 0 ${x3} ${y3}`,
    'Z',
  ].join(' ')
}

export const getHalfSectorPath = (
  center: Position,
  radius: {
    inner: number
    outer: number
  },
  direction: number,
) => {
  const angle = {
    start: direction - R_90,
    end: direction + R_90,
  }
  return getSectorPath(center, radius, angle)
}

export const getRingPath = (
  center: Position,
  radius: {
    inner: number
    outer: number
  },
) => {
  const cx = center.x
  const cy = center.y

  return [
    `M ${cx} ${cy}`,
    `m 0 ${-radius.outer}`,
    `a ${radius.outer} ${radius.outer} 0 1 0 1 0`,
    'Z',
    `m 1 ${radius.outer - radius.inner}`,
    `a ${radius.inner} ${radius.inner} 0 1 1 -1 0`,
    'Z',
  ].join(' ')
}
