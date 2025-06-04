import React, { RefObject, useContext, useRef } from 'react'

import { PitchCircleContext } from '@/components/PitchCircle'

import { useKey } from '@/hooks/useKey'
import { useMouse } from '@/hooks/useMouse'


interface PlayableWrapperProps {
  frequency: number
  triggerKey?: string | null
  children: React.ReactElement
}

const PlayableWrapper: React.FC<PlayableWrapperProps> = ({
  frequency,
  triggerKey,
  children,
}) => {
  const {
    playNote,
    stopNote,
  } = useContext(PitchCircleContext)


  const buttonRef = useRef<SVGCircleElement>(null)
  const mouseNoteToken = useRef<string | null>(null)
  const keyNoteToken = useRef<string | null>(null)

  const play = (ref: RefObject<string | null>) => {
    if (ref.current) ref.current = playNote(frequency, ref.current)
    else ref.current = playNote(frequency)
  }

  const stop = (ref: RefObject<string | null>) => {
    if (ref.current) {
      stopNote(ref.current)
      ref.current = null
    }
  }

  const mouseStartPlaying = () => play(mouseNoteToken)
  const mouseStopPlaying = () => stop(mouseNoteToken)
  const keyStartPlaying = () => play(keyNoteToken)
  const keyStopPlaying = () => stop(keyNoteToken)

  useMouse(buttonRef, mouseStartPlaying, mouseStopPlaying)
  useKey(triggerKey || '', keyStartPlaying, keyStopPlaying)

  return <g className="pitch-button" ref={buttonRef}>{children}</g>
}



interface PitchLineProps {
  isPlayable?: boolean
  frequency: number
  triggerKey?: string | null
}

const PitchButton: React.FC<PitchLineProps> = ({
  isPlayable = true,
  frequency,
  triggerKey,
}) => {
  const {
    center,
    baseFrequency,
    startRadius,
    radiusStep,
    startPitch,
  } = useContext(PitchCircleContext)

  const pitch = Math.log2(frequency / baseFrequency)
  const angle = pitch * 2 * Math.PI - Math.PI / 2

  const length = startRadius + radiusStep * (pitch - startPitch)
  // const labelRadius = 40

  const x = center.x + length * Math.cos(angle)
  const y = center.y + length * Math.sin(angle)

  // const textX = center.x + (length + labelRadius) * Math.cos(angle)
  // const textY = center.y + (length + labelRadius) * Math.sin(angle)

  const circle = <g>
    <circle
      cx={x}
      cy={y}
      r={5}
      fill="white"
      style={{ cursor: 'pointer' }}
    />
    {/* <circle
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
    </g> */}
  </g>

  return isPlayable
    ? <PlayableWrapper frequency={frequency} triggerKey={triggerKey}>{circle}</PlayableWrapper>
    : circle
}

export default PitchButton
