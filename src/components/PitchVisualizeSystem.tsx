import React, { createContext } from 'react'

import PitchCircle from '@/components/PitchCircle'

import PitchLadder from '@/components/PitchLadder'
import AudioManager from '@/utils/AudioManager'
import { JIConstraint } from '@/utils/Note'

interface PitchVisualizeSystemProps {
  baseFrequency: number
  startPitch: number
  endPitch: number
  defaultOctaveShift?: number
  JIConstraint?: JIConstraint
}

const defaultJIConstraint: JIConstraint = {
  maxPrime: 13,
  maxFactor: 25,
  maxDivision: 3,
}

/* eslint-disable @stylistic/indent */
const PitchVisualizeSystemContext = createContext<{
  baseFrequency: number
  startPitch: number
  endPitch: number
  JIConstraint: JIConstraint
  audioManager: React.RefObject<AudioManager | null>
  playNote: (frequency: number, token?: string) => string | null
  stopNote: (token: string) => string | null
}>({
  baseFrequency: 440 * Math.pow(2, -9 / 12), // Middle C
  startPitch: -2,
  endPitch: 3,
  JIConstraint: defaultJIConstraint,
  audioManager: React.createRef<AudioManager>(),
  playNote: () => null,
  stopNote: () => null,
})
/* eslint-enable @stylistic/indent */

const PitchVisualizeSystem: React.FC<PitchVisualizeSystemProps> = ({
  baseFrequency,
  startPitch,
  endPitch,
  JIConstraint = defaultJIConstraint,
}) => {
  const audioManager = React.useRef<AudioManager>(new AudioManager())

  return <PitchVisualizeSystemContext.Provider
    value={{
      baseFrequency,
      startPitch,
      endPitch,
      JIConstraint,
      audioManager,
      playNote: audioManager.current.play.bind(audioManager.current),
      stopNote: audioManager.current.stop.bind(audioManager.current),
    }}
  >
    <PitchCircle
      center={{ x: 720, y: 540 }}
      startRadius={250}
      radiusStep={50}
    />
    <PitchLadder
      startPoint={{ x: 1400, y: 980 }}
      endPoint={{ x: 1400, y: 100 }}
      width={200}
    />
  </PitchVisualizeSystemContext.Provider>
}

export default PitchVisualizeSystem
export { PitchVisualizeSystemContext }
