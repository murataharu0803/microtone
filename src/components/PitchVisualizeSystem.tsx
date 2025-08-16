import React from 'react'

import PitchCircle from '@/components/circle/PitchCircle'
import PitchGrid from '@/components/grid/PitchGrid'
import PitchLadder from '@/components/ladder/PitchLadder'

import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

import { useKey } from '@/hooks/useKey'

import AudioManager from '@/types/AudioManager'
import { defaultAxis } from '@/types/Axis'
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
      axis: defaultAxis,
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
      width={150}
    />
    <PitchGrid
      center={{ x: 1600, y: 500 }}
      spacing={{ x: 100, y: -100 }}
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
