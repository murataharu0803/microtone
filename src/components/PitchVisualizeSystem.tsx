import React from 'react'

import PitchCircle from '@/components/circle/PitchCircle'
import PitchGrid from '@/components/grid/PitchGrid'
import PitchLadder from '@/components/ladder/PitchLadder'

import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

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
  const pedalRef = React.useRef<boolean>(false)

  return <PitchVisualizeSystemContext.Provider
    value={{
      baseFrequency,
      startPitch,
      endPitch,
      JIConstraint,
      audioManager,
      pedalRef,
      playNote: audioManager.current.play.bind(audioManager.current),
      stopNote: audioManager.current.stop.bind(audioManager.current),
    }}
  >
    <PitchCircle
      center={{ x: 600, y: 500 }}
      startRadius={250}
      radiusStep={50}
    />
    <PitchLadder
      startPoint={{ x: 1170, y: 900 }}
      endPoint={{ x: 1170, y: 100 }}
      width={100}
    />
    <PitchGrid
      center={{ x: 1600, y: 500 }}
      spacing={{ x: 100, y: -100 }}
      triggerKeys={[
        ['', 'x', 's', 'w', '2'],
        ['', 'c', 'd', 'e', '3'],
        ['', 'v', 'f', 'r', '4'],
        ['', 'b', 'g', 't', '5'],
        ['', 'n', 'h', 'y', '6'],
        ['', 'm', 'j', 'u', '7'],
        ['', ',', 'k', 'i', '8'],
      ]}
    />
  </PitchVisualizeSystemContext.Provider>
}

export default PitchVisualizeSystem
