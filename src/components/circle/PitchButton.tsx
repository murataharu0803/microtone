import React, { useContext, useRef } from 'react'

import PitchLine from '@/components/circle/PitchLine'

import PitchCircleContext from '@/context/PitchCircleContext'
import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

import { useNote } from '@/hooks/useNote'

import Note from '@/types/Note'
import { getPointByRadiusAndAngle } from '@/utils/math'


interface PlayableWrapperProps {
  note: Note
  triggerKey?: string | null
  children: React.ReactElement
}

const PlayableWrapper: React.FC<PlayableWrapperProps> = ({ note, triggerKey, children }) => {
  const buttonRef = useRef<SVGCircleElement>(null)

  const { active } = useNote(note.frequency, buttonRef, triggerKey)

  return <g ref={buttonRef}>
    {active && <PitchLine note={note} color="white" />}
    {children}
  </g>
}


interface PitchLineProps {
  isPlayable?: boolean
  note: Note
  color?: string
  triggerKey?: string | null
}

const PitchButton: React.FC<PitchLineProps> = ({
  isPlayable = true,
  note,
  color = 'white',
  triggerKey,
}) => {
  const {
    center,
    startRadius,
    radiusStep,
  } = useContext(PitchCircleContext)
  const { startPitch } = useContext(PitchVisualizeSystemContext)

  const length = note.length(startRadius, radiusStep, startPitch)
  const point = getPointByRadiusAndAngle(center, length, note.angle)

  const circle = <>
    <PitchLine note={note} color="white" />
    <circle
      className="pitch-button"
      cx={point.x}
      cy={point.y}
      r={5}
      fill={color}
      style={{ cursor: 'pointer' }}
    />
  </>

  return isPlayable
    ? <PlayableWrapper note={note} triggerKey={triggerKey}>{circle}</PlayableWrapper>
    : <g>{circle}</g>
}

export default PitchButton
