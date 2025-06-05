import React, { useContext } from 'react'

import { PitchCircleContext } from '@/components/PitchCircle'
import { PitchVisualizeSystemContext } from '@/components/PitchVisualizeSystem'

import Note from '@/utils/Note'
import { ETNotation, JINotation } from '@/utils/pitchNotation'

const DISPLAY_RADIUS = 80
const FONT_SIZE = 16
const LINE_HEIGHT = 32

const FrequencyDisplay: React.FC<{ note: Note }> = ({ note }) => {
  const { center } = useContext(PitchCircleContext)
  const { baseFrequency, JIConstraint } = useContext(PitchVisualizeSystemContext)
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
    <text x={center.x} y={center.y - LINE_HEIGHT * 5 / 4}>
      {frequency.toFixed(2)}Hz
    </text>
    <text x={center.x} y={center.y - LINE_HEIGHT / 4}>
      {ETNotation(frequency, baseFrequency, 'oct')}
    </text>
    <text x={center.x} y={center.y + LINE_HEIGHT * 3 / 4}>
      {ETNotation(frequency, baseFrequency, 'standard')}
    </text>
    <text x={center.x} y={center.y + LINE_HEIGHT * 7 / 4}>
      {JINotation(frequency, baseFrequency, JIConstraint)}
    </text>
  </g>
}

const CenterDisplay: React.FC = () => {
  const { audioManager, center } = useContext(PitchCircleContext)
  const { baseFrequency } = useContext(PitchVisualizeSystemContext)

  const [frequencies, setFrequencies] = React.useState<number[]>(
    audioManager.current?.frequencyList || [],
  )

  audioManager.current?.subscribe(
    () => setFrequencies(audioManager.current?.frequencyList || []),
  )

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
