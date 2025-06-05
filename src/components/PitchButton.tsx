import React, { RefObject, useContext, useRef } from 'react'

import { PitchCircleContext } from '@/components/PitchCircle'
import { PitchLine } from '@/components/PitchLine'
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
  const mouseNoteToken = useRef<string | null>(null)
  const keyNoteToken = useRef<string | null>(null)

  const play = (ref: RefObject<string | null>) => {
    if (ref.current) ref.current = playNote(note.frequency, ref.current)
    else ref.current = playNote(note.frequency)
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

  return <g className="pitch-button" ref={buttonRef}>
    {mouseNoteToken.current && keyNoteToken.current &&
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

  const circle = <g><circle cx={x} cy={y} r={5} fill={color} style={{ cursor: 'pointer' }} /></g>

  return isPlayable
    ? <PlayableWrapper note={note} triggerKey={triggerKey}>{circle}</PlayableWrapper>
    : circle
}

export default PitchButton
