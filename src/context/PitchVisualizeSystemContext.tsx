import { createContext } from 'react'

import AudioManager from '@/types/AudioManager'
import Axis, { defaultAxis } from '@/types/Axis'
import JIConstraint, { defaultJIConstraint } from '@/types/JIConstraint'

interface PitchVisualizeSystemContextProps {
  baseFrequency: number
  startPitch: number
  endPitch: number
  JIConstraint: JIConstraint
  audioManager: AudioManager | null
  axis: Axis[]
}

const PitchVisualizeSystemContext = createContext<PitchVisualizeSystemContextProps>({
  baseFrequency: 440 * Math.pow(2, -9 / 12), // Middle C
  startPitch: -2,
  endPitch: 3,
  JIConstraint: defaultJIConstraint,
  audioManager: null,
  axis: defaultAxis,
})

export default PitchVisualizeSystemContext
