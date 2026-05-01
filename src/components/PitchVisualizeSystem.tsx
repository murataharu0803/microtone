import React from 'react'

import PitchCircle from '@/components/circle/PitchCircle'
import PitchGrid from '@/components/grid/PitchGrid'
import PitchLadder from '@/components/ladder/PitchLadder'

import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

import { useKey } from '@/hooks/useKey'

import AudioManager from '@/types/AudioManager'
import JIConstraint, { defaultJIConstraint } from '@/types/JIConstraint'

interface PitchVisualizeSystemProps {
  baseFrequency: number
  startPitch: number
  endPitch: number
  JIConstraint?: JIConstraint
}

const PitchVisualizeSystem: React.FC<PitchVisualizeSystemProps> = ({
  baseFrequency,
  startPitch,
  endPitch,
  JIConstraint = defaultJIConstraint,
}) => {
  const audioManager = React.useRef<AudioManager>(new AudioManager())

  useKey(
    '/',
    () => { audioManager.current.togglePedalOn() },
    () => { audioManager.current.togglePedalOff() },
  )

  return <PitchVisualizeSystemContext.Provider
    value={{
      baseFrequency,
      startPitch,
      endPitch,
      JIConstraint,
      audioManager: audioManager.current,
      // playNote: audioManager.play.bind(audioManager),
      // stopNote: audioManager.stop.bind(audioManager),
    }}
  >
    <PitchCircle
      center={{ x: 640, y: 500 }}
      startRadius={250}
      radiusStep={50}
    />
    <PitchLadder
      startPoint={{ x: 1200, y: 900 }}
      endPoint={{ x: 1200, y: 100 }}
      width={150}
    />
    <PitchGrid
      center={{ x: 800, y: 1280 }}
      spacing={{ x: 120, y: -120 }}
      triggerKeys={[
        ['', 'x', 's', 'w'],
        ['', 'c', 'd', 'e'],
        ['', 'v', 'f', 'r'],
        ['', 'b', 'g', 't'],
        ['', 'n', 'h', 'y'],
        ['', 'm', 'j', 'u'],
        ['', ',', 'k', 'i'],
      ]}
    />
  </PitchVisualizeSystemContext.Provider>
}

export default PitchVisualizeSystem
