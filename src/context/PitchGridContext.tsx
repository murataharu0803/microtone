import { createContext } from 'react'

import Axis, { defaultAxis } from '@/types/Axis'
import Position from '@/types/Position'

interface PitchGridContextProps {
  center: Position
  spacing: Position
  axis: Axis[]
}

const PitchGridContext = createContext<PitchGridContextProps>({
  center: { x: 500, y: 500 },
  spacing: { x: 100, y: 100 },
  axis: defaultAxis,
})

export default PitchGridContext
