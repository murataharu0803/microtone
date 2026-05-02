import Range from '@/types/Range'

export enum Dimension {
  D1 = 'D1',
  D2 = 'D2',
  D3 = 'D3',
  D4 = 'D4',
  D5 = 'D5',
  D6 = 'D6',
}

export interface DimensionRange {
  /* max and min shift for the dimension */
  shift: Range
  display: Range
}
