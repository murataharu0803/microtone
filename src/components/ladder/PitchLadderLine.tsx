import React, { useContext, useRef, useState } from 'react'

import { PitchLadderContext } from '@/components/ladder/PitchLadder'
import PitchLadderLineLine from '@/components/ladder/PitchLadderLineLine'
import { PitchVisualizeSystemContext } from '@/components/PitchVisualizeSystem'

import { useMouse } from '@/hooks/useMouse'

import { distance } from '@/utils/math'
import Note from '@/utils/Note'

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

  const getLineEndPoints = (shift = 0) => {
    const pitch = note.pitch
    const range = endPitch - startPitch
    const pitchPerPixel = range / distance(startPoint, endPoint)
    const ratio =  (pitch - startPitch) / range + shift * pitchPerPixel
    const pos = {
      x: startPoint.x + ratio * (endPoint.x - startPoint.x),
      y: startPoint.y + ratio * (endPoint.y - startPoint.y),
    }

    const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x)
    const theta1 = angle + Math.PI / 2
    const theta2 = angle - Math.PI / 2

    return {
      x1: pos.x + width / 2 * Math.cos(theta1),
      y1: pos.y + width / 2 * Math.sin(theta1),
      x2: pos.x + width / 2 * Math.cos(theta2),
      y2: pos.y + width / 2 * Math.sin(theta2),
    }
  }

  const t = getLineEndPoints(MOUSE_SNAP)
  const b = getLineEndPoints(-MOUSE_SNAP)
  const hoverBoxPoints = `${t.x1},${t.y1} ${t.x2},${t.y2} ${b.x2},${b.y2} ${b.x1},${b.y1}`

  const box = <>
    <PitchLadderLineLine note={note} color={color} shrink={shrink} />
    {isPlayable && <polygon
      className="pitch-ladder-box"
      points={hoverBoxPoints}
      fill="transparent"
    />}
  </>

  return isPlayable
    ? <PlayableWrapper note={note} shrink={shrink}>{box}</PlayableWrapper>
    : <g>{box}</g>
}

export default PitchLadderLine
