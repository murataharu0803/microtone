import React from 'react'

import PitchCircle from '@/components/circle/PitchCircle'
import PitchGrid from '@/components/grid/PitchGrid'
import PitchLadder from '@/components/ladder/PitchLadder'

import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

import { useKey } from '@/hooks/useKey'

import AudioManager from '@/types/AudioManager'

interface PitchVisualizeSystemProps {
  baseFrequency: number
  startPitch: number
  endPitch: number
}

const PitchVisualizeSystem: React.FC<PitchVisualizeSystemProps> = ({
  baseFrequency,
  startPitch,
  endPitch,
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
      audioManager: audioManager.current,
    }}
  >
    <PitchCircle
      center={{ x: 640, y: 500 }}
      startRadius={250}
      radiusStep={50}
      mouseSnap={10}
    />
    <PitchLadder
      startPoint={{ x: 1200, y: 900 }}
      endPoint={{ x: 1200, y: 100 }}
      width={150}
      mouseSnap={40}
    />
    <PitchGrid
      center={{ x: 800, y: 1280 }}
      spacing={[
        { x: 120, y: 0, z: 0 },
        { x: 0, y: -120, z: 0 },
        { x: 140, y: 140, z: 0.25 },
      ]}
      triggerKeys={[
        [],
        ['x', 'c', 'v', 'b', 'n', 'm', ','],
        ['s', 'd', 'f', 'g', 'h', 'j', 'k'],
        ['w', 'e', 'r', 't', 'y', 'u', 'i'],
        ['2', '3', '4', '5', '6', '7', '8'],
      ]}
    />
  </PitchVisualizeSystemContext.Provider>
}

export default PitchVisualizeSystem
