import { createContext } from 'react'

import Position from '@/types/Position'

interface PitchCircleContextProps {
  center: Position
  startRadius: number
  radiusStep: number
  mouseSnap: number
}

const PitchCircleContext = createContext<PitchCircleContextProps>({
  center: { x: 500, y: 500 },
  startRadius: 150,
  radiusStep: 400,
  mouseSnap: 40,
})

export default PitchCircleContext
