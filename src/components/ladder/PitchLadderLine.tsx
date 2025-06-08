import React, { useContext, useRef, useState } from 'react'

import PitchLadderLineLine from '@/components/ladder/PitchLadderLineLine'

import PitchLadderContext from '@/context/PitchLadderContext'
import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

import { useMouse } from '@/hooks/useMouse'

import { getAngle, getPositionOnLineSegment, getVerticalEndpoints, mapRange } from '@/utils/math'

import Note from '@/types/Note'
import { R_90 } from '@/types/constants'

const MOUSE_SNAP = 5

interface PlayableWrapperProps {
  note: Note
  shrink?: number
  children: React.ReactElement
}

const PlayableWrapper: React.FC<PlayableWrapperProps> = ({ note, shrink, children }) => {
  const { playNote, stopNote } = useContext(PitchVisualizeSystemContext)

  const buttonRef = useRef<SVGCircleElement>(null)
  const mouseNoteState = useState<string | null>(null)

  const play = (state: typeof mouseNoteState) => {
    const [value, setValue] = state
    if (value) setValue(playNote(note.frequency, value))
    else setValue(playNote(note.frequency))
  }

  const stop = (state: typeof mouseNoteState) => {
    const [value, setValue] = state
    if (value) {
      stopNote(value)
      setValue(null)
    }
  }

  const mouseStartPlaying = () => play(mouseNoteState)
  const mouseStopPlaying = () => stop(mouseNoteState)

  useMouse(buttonRef, mouseStartPlaying, mouseStopPlaying)

  return <g ref={buttonRef}>
    {mouseNoteState[0] &&
      <PitchLadderLineLine note={note} shrink={shrink} color="white" />
    }{children}
  </g>
}


interface PitchLadderLineProps {
  isPlayable?: boolean
  note: Note
  color: string
  shrink?: number
}

const PitchLadderLine: React.FC<PitchLadderLineProps> = ({
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
    <PitchLadderLineLine note={note} color={color} shrink={shrink} />
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

export default PitchLadderLine
