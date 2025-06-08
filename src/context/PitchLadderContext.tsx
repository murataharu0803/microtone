import { createContext } from 'react'

import Position from '@/types/Position'

interface PitchLadderContextProps {
  startPoint: Position
  endPoint: Position
  width: number
}

const PitchLadderContext = createContext<PitchLadderContextProps>({
  startPoint: { x: 500, y: 100 },
  endPoint: { x: 500, y: 900 },
  width: 150,
})

export default PitchLadderContext
