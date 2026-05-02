import React, { useContext } from 'react'

import PitchCircleContext from '@/context/PitchCircleContext'
import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'
import { usePlayingFrequencies } from '@/hooks/usePlayingFrequencies'

import { ETNotation } from '@/utils/pitchNotation'

import Note from '@/types/Note'

const DISPLAY_RADIUS = 80
const FONT_SIZE = 16
const LINE_HEIGHT = 32

const FrequencyDisplay: React.FC<{ note: Note }> = ({ note }) => {
  const { center } = useContext(PitchCircleContext)
  const { baseFrequency } = useContext(PitchVisualizeSystemContext)
  const frequency = note.frequency

  return <g
    fontSize={FONT_SIZE}
    fill="white"
    textAnchor="middle"
  >
    <circle
      cx={center.x}
      cy={center.y}
      r={DISPLAY_RADIUS}
      fill="#000000A0"
      stroke="#888888"
      strokeWidth={1}
    />
    <text x={center.x} y={center.y - LINE_HEIGHT * 3 / 4}>
      {frequency.toFixed(2)}Hz
    </text>
    <text x={center.x} y={center.y + LINE_HEIGHT / 4}>
      {ETNotation(frequency, baseFrequency, 'oct')}
    </text>
    <text x={center.x} y={center.y + LINE_HEIGHT * 5 / 4}>
      {ETNotation(frequency, baseFrequency, 'standard')}
    </text>
  </g>
}

const CenterDisplay: React.FC = () => {
  const { center } = useContext(PitchCircleContext)
  const { baseFrequency } = useContext(PitchVisualizeSystemContext)

  const { frequencies } = usePlayingFrequencies()

  return <g
    fontSize="10"
    fill="white"
    textAnchor="middle"
  >
    <circle
      cx={center.x}
      cy={center.y}
      r={DISPLAY_RADIUS}
      fill="#000000A0"
      stroke="#888888"
      strokeWidth={1}
    />
    {frequencies.map((frequency, index) =>
      <React.Fragment key={`${index}-${frequency}`}>
        <FrequencyDisplay note={new Note({ baseFrequency, type: 'frequency', value: frequency })} />
      </React.Fragment>,
    )}
  </g>
}

export default CenterDisplay
