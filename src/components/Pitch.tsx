import React, { useContext } from 'react'

import { PitchCircleContext } from '@/components/PitchCircle'

import { useAudio } from '@/hooks/useAudio'
import { useKey } from '@/hooks/useKey'
import { useMouse } from '@/hooks/useMouse'

import { ETNotation, JINotation } from '@/utils/pitchNotation'

const PitchLine: React.FC<{ frequency: number }> = ({ frequency }) => {
  const { center, radius, baseFrequency } = useContext(PitchCircleContext)
  const pitch = Math.log2(frequency / baseFrequency)
  const angle = pitch * 2 * Math.PI - Math.PI / 2
  const x = center.x + radius * Math.cos(angle)
  const y = center.y + radius * Math.sin(angle)

  return <g>
    <line
      x1={center.x}
      y1={center.y}
      x2={x}
      y2={y}
      stroke="#888"
      strokeWidth={0.5}
    />
  </g>
}

interface PitchLineProps {
  frequency: number
  triggerKey?: string | null
}

const PitchLineWithButton: React.FC<PitchLineProps> = ({
  frequency,
  triggerKey,
}) => {
  const {
    center,
    radius,
    baseFrequency,
    JIConstraint: {
      maxPrime,
      maxFactor,
      maxDivision,
    },
  } = useContext(PitchCircleContext)

  const buttonRef = React.useRef<SVGCircleElement>(null)

  const pitch = Math.log2(frequency / baseFrequency)
  const angle = pitch * 2 * Math.PI - Math.PI / 2

  const length = radius + 15
  const labelRadius = 40

  const x = center.x + length * Math.cos(angle)
  const y = center.y + length * Math.sin(angle)

  const textX = center.x + (length + labelRadius) * Math.cos(angle)
  const textY = center.y + (length + labelRadius) * Math.sin(angle)

  const { playTone, stopTone } = useAudio()
  useMouse(
    buttonRef,
    () => playTone(frequency),
    stopTone,
  )
  useKey(triggerKey || '', () => playTone(frequency), stopTone)

  return (
    <g>
      <line
        x1={center.x}
        y1={center.y}
        x2={x}
        y2={y}
        stroke="#888"
        strokeWidth={0.5}
      />
      <g ref={buttonRef}>
        <circle
          cx={textX}
          cy={textY}
          r={labelRadius}
          stroke="#888888"
          strokeWidth={1}
          style={{ cursor: 'pointer' }}
        />
        <g
          fontSize="10"
          fill="white"
          textAnchor="middle"
        >
          <text x={textX} y={textY - 20}>
            {frequency.toFixed(2)}Hz
          </text>
          <text x={textX} y={textY - 4}>
            {ETNotation(frequency, baseFrequency, 'oct')}
          </text>
          <text x={textX} y={textY + 12}>
            {ETNotation(frequency, baseFrequency, 'standard')}
          </text>
          <text x={textX} y={textY + 28}>
            {JINotation(
              frequency,
              baseFrequency,
              maxPrime,
              maxFactor,
              maxDivision,
            )}
          </text>
        </g>
      </g>
    </g>
  )
}

interface PitchButtonProps {
  show?: ConstrainBoolean
  frequency: number
  triggerKey?: string | null
}

const Pitch: React.FC<PitchButtonProps> = ({
  show = true,
  frequency,
  triggerKey = null,
}) => show
  ? <PitchLineWithButton
    frequency={frequency}
    triggerKey={triggerKey}
  />
  : <PitchLine frequency={frequency} />

export default Pitch
