import React, { useContext, useEffect, useRef } from 'react'

import { PitchLadderContext } from '@/components/PitchLadder'
import PitchLadderLine from '@/components/PitchLadderLine'
import { PitchVisualizeSystemContext } from '@/components/PitchVisualizeSystem'
import { SVGContext } from '@/components/SVGWithContext'

import { useMouse } from '@/hooks/useMouse'

import Note from '@/utils/Note'
import { distance, projectPointOnLine } from '@/utils/math'

const MOUSE_SNAP = 5

const PitchLadderMouse: React.FC = () => {
  const { mousePosition, SVGRef } = useContext(SVGContext)
  const {
    startPoint,
    endPoint,
    width,
  } = useContext(PitchLadderContext)
  const {
    baseFrequency,
    startPitch,
    endPitch,
    playNote,
    stopNote,
  } = useContext(PitchVisualizeSystemContext)

  const noteToken = useRef<string | null>(null)

  const getTone = () => {
    if (!mousePosition) return null

    const projectPoint = projectPointOnLine(
      mousePosition,
      startPoint,
      endPoint,
    )

    const dist = distance(mousePosition, projectPoint)
    if (dist > width / 2 + MOUSE_SNAP) return null

    const fullDistance = distance(endPoint, startPoint)
    if (distance(projectPoint, startPoint) > fullDistance) return null
    if (distance(projectPoint, endPoint) > fullDistance) return null

    const ratio = distance(projectPoint, startPoint) / fullDistance
    const pitch = startPitch + ratio * (endPitch - startPitch)
    return baseFrequency * Math.pow(2, pitch)
  }

  const playMouseTone = (pressed = true) => {
    if (!pressed) return
    const frequency = getTone()
    if (frequency) {
      if (noteToken.current) noteToken.current = playNote(frequency, noteToken.current)
      else noteToken.current = playNote(frequency)
    } else if (noteToken.current) {
      stopNote(noteToken.current)
      noteToken.current = null
    }
  }

  const stopMouseTone = () => {
    if (noteToken.current) {
      stopNote(noteToken.current)
      noteToken.current = null
    }
  }

  useMouse(SVGRef, playMouseTone, stopMouseTone, playMouseTone)

  useEffect(() => () => {
    if (noteToken.current) {
      stopNote(noteToken.current)
      noteToken.current = null
    }
  }, [stopNote])

  const frequency = getTone()
  if (!frequency) return null

  const note = new Note({
    baseFrequency,
    type: 'frequency',
    value: frequency,
  })

  return <PitchLadderLine
    key={note.pitch}
    isPlayable={false}
    note={note}
    color="white"
  />
}

export default PitchLadderMouse
