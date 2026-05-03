import { createContext } from 'react'

import { AxisUnitSpacing } from '@/types/Dimension'
import Position from '@/types/Position'

interface PitchGridContextProps {
  center: Position
  spacing: AxisUnitSpacing[]
}

const PitchGridContext = createContext<PitchGridContextProps>({
  center: { x: 500, y: 500 },
  spacing: [{ x: 100, y: 0, z: 0 }, { x: 0, y: 100, z: 0 }, { x: 25, y: -25, z: 0.25 }],
})

export default PitchGridContext
