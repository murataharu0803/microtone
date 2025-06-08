import React, { useContext, useEffect, useRef } from 'react'

import PitchButton from '@/components/circle/PitchButton'
import PitchLine from '@/components/circle/PitchLine'

import PitchCircleContext from '@/context/PitchCircleContext'
import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'
import SVGContext from '@/context/SVGContext'

import { useMouse } from '@/hooks/useMouse'

import { distance } from '@/utils/math'

import Note from '@/types/Note'
import { R_360, R_90 } from '@/types/constants'

const MOUSE_SNAP = 40

const PitchCircleMouse: React.FC = () => {
  const { mousePosition, SVGRef } = useContext(SVGContext)
  const {
    center,
    startRadius,
    radiusStep,
  } = useContext(PitchCircleContext)
  const {
    audioManager,
    baseFrequency,
    startPitch,
    endPitch,
  } = useContext(PitchVisualizeSystemContext)

  const noteToken = useRef<string | null>(null)

  const startOctave = Math.floor(startPitch)
  const endOctave = Math.ceil(endPitch)
  const octaves = Array.from(
    { length: endOctave - startOctave + 1 },
    (_, i) => i + startOctave,
  )

  const getTone = () => {
    if (!mousePosition) return null

    const distanceToCenter = distance(mousePosition, center)
    const mouseAngle =
      Math.atan2(mousePosition.y - center.y, mousePosition.x - center.x)
    const mouseNormalizedPitch = ((mouseAngle + R_90) / R_360 + 1) % 1
    const deltaPitch = (mouseNormalizedPitch - startPitch) % 1
    const firstDeltaPitch = deltaPitch < 0 ? deltaPitch + 1 : deltaPitch

    const pitches = octaves
      .map(octave => ({ pitch: firstDeltaPitch + startPitch + octave, octave }))
      .filter(note => note.pitch >= startPitch && note.pitch <= endPitch)
      .map(note => ({
        distance: (note.pitch - startPitch) * radiusStep + startRadius,
        pitch: note.pitch,
        octave: note.octave,
      }))
    const closestPitch = pitches.reduce(
      (prev, curr) =>
        Math.abs(curr.distance - distanceToCenter) < Math.abs(prev.distance - distanceToCenter)
          ? curr : prev,
      pitches[0],
    )
    if (Math.abs(closestPitch.distance - distanceToCenter) > MOUSE_SNAP) return null

    const mouseFrequency = baseFrequency * Math.pow(2, closestPitch.pitch)
    return { frequency: mouseFrequency, ...closestPitch }
  }

  const playMouseTone = (pressed = true) => {
    if (!pressed) return
    const frequency = getTone()?.frequency
    if (frequency) {
      if (noteToken.current)
        noteToken.current = audioManager?.play(frequency, noteToken.current) || null
      else noteToken.current = audioManager?.play(frequency) || null
    } else if (noteToken.current) noteToken.current = audioManager?.stop(noteToken.current) || null
  }

  const stopMouseTone = () => {
    if (noteToken.current) noteToken.current = audioManager?.stop(noteToken.current) || null
  }

  useMouse(SVGRef, playMouseTone, stopMouseTone, playMouseTone)

  useEffect(() => () => {
    if (noteToken.current) noteToken.current = audioManager?.stop(noteToken.current) || null
  }, [audioManager])

  const tone = getTone()
  if (!tone) return null

  const note = new Note({
    baseFrequency,
    type: 'frequency',
    value: tone.frequency,
  })

  return <>
    <PitchLine note={note} color="white" />
    <PitchButton note={note} isPlayable={false} />
  </>
}

export default PitchCircleMouse
