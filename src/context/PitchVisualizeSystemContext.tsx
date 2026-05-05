import { createContext } from 'react'

import AudioManager from '@/types/AudioManager'
import ChordManager from '@/types/ChordManager'

interface PitchVisualizeSystemContextProps {
  baseFrequency: number
  startPitch: number
  endPitch: number
  audioManager: AudioManager | null
  chordManager: ChordManager | null
}


const PitchVisualizeSystemContext = createContext<PitchVisualizeSystemContextProps>({
  baseFrequency: 440 * Math.pow(2, -9 / 12), // Middle C
  startPitch: -2,
  endPitch: 3,
  audioManager: null,
  chordManager: null,
})

export default PitchVisualizeSystemContext
