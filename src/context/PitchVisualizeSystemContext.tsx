import React, { createContext } from 'react'

import AudioManager from '@/types/AudioManager'
import JIConstraint, { defaultJIConstraint } from '@/types/JIConstraint'

interface PitchVisualizeSystemContextProps {
  baseFrequency: number
  startPitch: number
  endPitch: number
  JIConstraint: JIConstraint
  audioManager: React.RefObject<AudioManager | null>
  pedalRef: React.RefObject<boolean | null>
  playNote: (frequency: number, token?: string) => string | null
  stopNote: (token: string) => string | null
}


const PitchVisualizeSystemContext = createContext<PitchVisualizeSystemContextProps>({
  baseFrequency: 440 * Math.pow(2, -9 / 12), // Middle C
  startPitch: -2,
  endPitch: 3,
  JIConstraint: defaultJIConstraint,
  audioManager: React.createRef<AudioManager>(),
  pedalRef: React.createRef<boolean>(),
  playNote: () => null,
  stopNote: () => null,
})

export default PitchVisualizeSystemContext
