import { createContext } from 'react'

import Position from '@/types/Position'

interface ChordPresetsContextProps {
  topLeft: Position
  boxRadius: number
  boxWidth: number
  boxHeight: number
  gap: number
}

const ChordPresetsContext = createContext<ChordPresetsContextProps>({
  topLeft: { x: 1620, y: 100 },
  boxRadius: 8,
  boxWidth: 360,
  boxHeight: 48,
  gap: 8,
})

export default ChordPresetsContext
