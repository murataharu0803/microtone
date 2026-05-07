import React from 'react'

import { ChordPresets } from '@/components/chords/ChordPresets'
import PitchCircle from '@/components/circle/PitchCircle'
import PitchGrid from '@/components/grid/PitchGrid'
import PitchLadder from '@/components/ladder/PitchLadder'

import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

import { useKey } from '@/hooks/useKey'

import AudioManager from '@/types/AudioManager'
import ChordManager from '@/types/ChordManager'
import ChordPresetManager from '@/types/ChordPresetManager'

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
  const chordManager = React.useRef<ChordManager>(new ChordManager())
  const chordPresetManager = React.useRef<ChordPresetManager>(new ChordPresetManager())

  useKey(
    '/',
    () => {
      audioManager.current.togglePedalOn()
      chordManager.current.togglePedalOn()
    },
    () => {
      audioManager.current.togglePedalOff()
      chordManager.current.togglePedalOff()
    },
  )

  useKey(
    'Shift',
    () => {
      audioManager.current.stopAll()
      chordManager.current.stopAll()
    },
    () => {
      audioManager.current.stopAll()
      chordManager.current.stopAll()
    },
  )

  return <PitchVisualizeSystemContext.Provider
    value={{
      baseFrequency,
      startPitch,
      endPitch,
      audioManager: audioManager.current,
      chordManager: chordManager.current,
      chordPresetManager: chordPresetManager.current,
    }}
  >
    <PitchCircle
      center={{ x: 640, y: 500 }}
      startRadius={200}
      radiusStep={40}
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
        [],
      ]}
    />
    <ChordPresets
      topLeft={{ x: 1440, y: 80 }}
      width={400}
      triggerKeys={['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=']}
    />
  </PitchVisualizeSystemContext.Provider>
}

export default PitchVisualizeSystem
