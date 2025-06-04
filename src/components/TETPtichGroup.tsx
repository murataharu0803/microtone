import React, { useContext } from 'react'

import PitchButton from '@/components/PitchButton'
import { PitchCircleContext } from '@/components/PitchCircle'
import { PitchLine } from '@/components/PitchLine'

interface TETPitchGroupProps {
  isPlayable?: boolean
  TET: number
  triggerKeys?: string[]
}

const TETPitchGroup: React.FC<TETPitchGroupProps> = ({
  isPlayable = true,
  TET = 12,
  triggerKeys = [],
}) => {
  const {
    baseFrequency,
    startPitch,
    endPitch,
  } = useContext(PitchCircleContext)

  const startOctave = Math.floor(startPitch)
  const endOctave = Math.ceil(endPitch)
  const octaves = Array.from(
    { length: endOctave - startOctave + 1 },
    (_, i) => i + startOctave,
  )

  const tones = Array.from({ length: TET }, (_, step) => ({
    pitch: step / TET,
    step,
  }))

  const allTones = tones.map(tone =>
    octaves.map(octave => ({
      ...tone,
      octave,
      frequency: baseFrequency * Math.pow(2, octave + tone.pitch),
      triggerKey: octave === 1 ? triggerKeys[tone.step] : null,
    })).filter(tone =>
      tone.pitch + tone.octave >= startPitch && tone.pitch + tone.octave <= endPitch,
    ),
  ).flat()

  return <g style={{ opacity: isPlayable ? 1 : 0.5 }}>
    {tones.map(tone => {
      return <PitchLine
        key={`${TET}-TET-${tone.step}`}
        pitch={tone.pitch}
        color="#888888"
      />
    })}
    {allTones.reverse().map(tone => <g key={tone.octave + tone.pitch}>
      {isPlayable && <PitchLine
        pitch={tone.pitch}
        octave={tone.octave}
        color="#888888"
      />}
      <PitchButton
        isPlayable={isPlayable}
        frequency={tone.frequency}
        triggerKey={tone.triggerKey}
      />
    </g>)}
  </g>
}

export default TETPitchGroup
