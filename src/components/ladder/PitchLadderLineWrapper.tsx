import React, { useRef } from 'react'

import PitchLadderLine from '@/components/ladder/PitchLadderLine'

import PitchLadderContext from '@/context/PitchLadderContext'
import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

import { getAngle, getPositionOnLineSegment, getVerticalEndpoints, mapRange } from '@/utils/math'

import { useNote } from '@/hooks/useNote'
import Note from '@/types/Note'
import { R_90 } from '@/utils/math'

const MOUSE_SNAP = 10

interface PlayableWrapperProps {
  note: Note
  shrink?: number
  children: React.ReactElement
}

const PlayableWrapper: React.FC<PlayableWrapperProps> = ({ note, shrink, children }) => {
  const buttonRef = useRef<SVGCircleElement>(null)

  const { active } = useNote(note.frequency, buttonRef)

  return <g ref={buttonRef}>
    {active &&
      <PitchLadderLine note={note} shrink={shrink} color="white" />
    }{children}
  </g>
}


interface PitchLadderLineWrapperProps {
  isPlayable?: boolean
  note: Note
  color: string
  shrink?: number
}

const PitchLadderLineWrapper: React.FC<PitchLadderLineWrapperProps> = ({
  isPlayable = true,
  note,
  color,
  shrink = 0,
}) => {
  const { startPitch, endPitch } = React.useContext(PitchVisualizeSystemContext)
  const { startPoint, endPoint, width } = React.useContext(PitchLadderContext)

  const ratio = mapRange([startPitch, endPitch], [0, 1], note.pitch)
  const point = getPositionOnLineSegment([startPoint, endPoint], ratio)
  const angle = getAngle(startPoint, endPoint)
  const endPoints = getVerticalEndpoints(point, width * (1 - shrink), angle)
  const l = getVerticalEndpoints(endPoints[0], MOUSE_SNAP, angle + R_90)
  const r = getVerticalEndpoints(endPoints[1], MOUSE_SNAP, angle + R_90)
  const points = [l[0], l[1], r[1], r[0]].map(p => `${p.x},${p.y}`).join(' ')

  const box = <>
    <PitchLadderLine note={note} color={color} shrink={shrink} />
    {isPlayable && <polygon
      className="pitch-ladder-box"
      points={points}
      fill="transparent"
    />}
  </>

  return isPlayable
    ? <PlayableWrapper note={note} shrink={shrink}>{box}</PlayableWrapper>
    : <g>{box}</g>
}

export default PitchLadderLineWrapper
