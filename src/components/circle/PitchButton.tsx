import React, { useContext, useRef, useState } from 'react'

import { PitchCircleContext } from '@/components/circle/PitchCircle'
import { PitchLine } from '@/components/circle/PitchLine'
import { PitchVisualizeSystemContext } from '@/components/PitchVisualizeSystem'

import { useKey } from '@/hooks/useKey'
import { useMouse } from '@/hooks/useMouse'

import Note from '@/utils/Note'


interface PlayableWrapperProps {
  note: Note
  triggerKey?: string | null
  children: React.ReactElement
}

const PlayableWrapper: React.FC<PlayableWrapperProps> = ({ note, triggerKey, children }) => {
  const { playNote, stopNote } = useContext(PitchVisualizeSystemContext)

  const buttonRef = useRef<SVGCircleElement>(null)
  const mouseNoteState = useState<string | null>(null)
  const keyNoteState = useState<string | null>(null)

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
  const keyStartPlaying = () => play(keyNoteState)
  const keyStopPlaying = () => stop(keyNoteState)

  useMouse(buttonRef, mouseStartPlaying, mouseStopPlaying)
  useKey(triggerKey || '', keyStartPlaying, keyStopPlaying)

  return <g ref={buttonRef}>
    {(mouseNoteState[0] || keyNoteState[0]) &&
      <PitchLine note={note} color="white" />
    }{children}
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
  const x = center.x + length * Math.cos(note.angle)
  const y = center.y + length * Math.sin(note.angle)

  const circle = <>
    <PitchLine note={note} color="white" />
    <circle
      className="pitch-button"
      cx={x}
      cy={y}
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
