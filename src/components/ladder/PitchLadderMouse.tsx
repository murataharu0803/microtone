import React, { useCallback, useContext, useEffect, useRef } from 'react'

import PitchLadderLine from '@/components/ladder/PitchLadderLine'

import PitchLadderContext from '@/context/PitchLadderContext'
import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'
import SVGContext from '@/context/SVGContext'

import { useMouse } from '@/hooks/useMouse'

import { getDistanceToLine, getRatioOnLineSegment, mapRange } from '@/utils/math'

import Note from '@/types/Note'

const MOUSE_SNAP = 10

const PitchLadderMouse: React.FC = () => {
  const { mousePosition, SVGRef } = useContext(SVGContext)
  const {
    startPoint,
    endPoint,
    width,
  } = useContext(PitchLadderContext)
  const {
    baseFrequency,
    audioManager,
    startPitch,
    endPitch,
  } = useContext(PitchVisualizeSystemContext)

  const noteToken = useRef<string | null>(null)

  const play = useCallback((frequency: number) => {
    if (noteToken.current)
      noteToken.current = audioManager?.play(frequency, noteToken.current) || null
    else
      noteToken.current = audioManager?.play(frequency) || null
  }, [audioManager])

  const stop = useCallback(() => {
    if (noteToken.current)
      noteToken.current = audioManager?.stop(noteToken.current) || null
  }, [audioManager])

  const getTone = () => {
    if (!mousePosition) return null

    const dist = getDistanceToLine(mousePosition, [startPoint, endPoint])
    if (dist > width / 2 + MOUSE_SNAP) return null

    const ratio = getRatioOnLineSegment(mousePosition, [startPoint, endPoint])
    if (ratio < 0 || ratio > 1) return null

    const pitch = mapRange([0, 1], [startPitch, endPitch], ratio)
    return baseFrequency * Math.pow(2, pitch)
  }

  const playMouseTone = (pressed = true) => {
    if (!pressed) return
    const frequency = getTone()
    if (frequency) play(frequency)
    else stop()
  }

  useMouse(SVGRef, playMouseTone, stop, playMouseTone)

  useEffect(() => () => {
    stop()
  }, [stop])

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
    width={2}
    color="white"
  />
}

export default PitchLadderMouse
