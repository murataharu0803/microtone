export enum Dimension {
  D1 = 'D1',
  D2 = 'D2',
  D3 = 'D3',
  D4 = 'D4',
  D5 = 'D5',
  D6 = 'D6',
}

export const D1 = Dimension.D1
export const D2 = Dimension.D2
export const D3 = Dimension.D3
export const D4 = Dimension.D4
export const D5 = Dimension.D5
export const D6 = Dimension.D6

export interface AxisUnitSpacing {
  x: number
  y: number
  z: number
}
