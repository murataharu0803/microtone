import { R_180, R_360 } from '@/types/constants'
import Position from '@/types/Position'

const getSectorPath = (
  center: Position,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
) => {
  const a0 = startAngle
  const a1 = endAngle
  const cx = center.x
  const cy = center.y

  const x0 = cx + outerRadius * Math.cos(a0)
  const y0 = cy + outerRadius * Math.sin(a0)
  const x1 = cx + outerRadius * Math.cos(a1)
  const y1 = cy + outerRadius * Math.sin(a1)

  const x2 = cx + innerRadius * Math.cos(a1)
  const y2 = cy + innerRadius * Math.sin(a1)
  const x3 = cx + innerRadius * Math.cos(a0)
  const y3 = cy + innerRadius * Math.sin(a0)

  const largeArc = (a1 - a0) % (R_360) > R_180 ? 1 : 0

  return [
    `M ${x0} ${y0}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x1} ${y1}`,
    `L ${x2} ${y2}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x3} ${y3}`,
    'Z',
  ].join(' ')
}

const getHalfSectorPath = (
  center: Position,
  innerRadius: number,
  outerRadius: number,
  direction: 'up' | 'down',
) => {
  const startAngle = direction === 'up' ? -R_180 : 0
  const endAngle = direction === 'up' ? 0 : R_180
  return getSectorPath(center, innerRadius, outerRadius, startAngle, endAngle)
}

const getRingPath = (
  center: Position,
  innerRadius: number,
  outerRadius: number,
) => {
  const cx = center.x
  const cy = center.y

  return [
    `M ${cx} ${cy}`,
    `m 0 ${-outerRadius}`,
    `a ${outerRadius} ${outerRadius} 0 1 0 1 0`,
    'Z',
    `m 1 ${outerRadius - innerRadius}`,
    `a ${innerRadius} ${innerRadius} 0 1 1 -1 0`,
    'Z',
  ].join(' ')
}

export { getHalfSectorPath, getRingPath, getSectorPath }

