import { createContext } from 'react'

import Position from '@/types/Position'

interface PitchGridContextProps {
  center: Position
  spacing: Position
}

const PitchGridContext = createContext<PitchGridContextProps>({
  center: { x: 500, y: 500 },
  spacing: { x: 100, y: 100 },
})

export default PitchGridContext
