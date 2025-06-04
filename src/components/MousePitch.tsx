import React, { useContext, useEffect, useRef } from 'react'

import PitchButton from '@/components/PitchButton'
import { PitchCircleContext } from '@/components/PitchCircle'
import { SVGContext } from '@/components/SVGWithContext'

import { PitchLine } from '@/components/PitchLine'
import { useMouse } from '@/hooks/useMouse'

const MOUSE_SNAP = 40

const MousePitch: React.FC = () => {
  const { mousePosition, SVGRef } = useContext(SVGContext)
  const {
    baseFrequency,
    center,
    startPitch,
    endPitch,
    startRadius,
    radiusStep,
    playNote,
    stopNote,
  } = useContext(PitchCircleContext)

  const noteToken = useRef<string | null>(null)

  const startOctave = Math.floor(startPitch)
  const endOctave = Math.ceil(endPitch)
  const octaves = Array.from(
    { length: endOctave - startOctave + 1 },
    (_, i) => i + startOctave,
  )

  const getNote = () => {
    if (!mousePosition) return null

    const distanceToCenter = Math.sqrt(
      Math.pow(mousePosition.x - center.x, 2) +
      Math.pow(mousePosition.y - center.y, 2),
    )

    const mouseAngle =
      Math.atan2(mousePosition.y - center.y, mousePosition.x - center.x) + 5 * Math.PI / 2
    const mouseNormalizedPitch = mouseAngle / (2 * Math.PI) % 1
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
    const frequency = getNote()?.frequency
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
    console.log('MousePitch unmounted')
    if (noteToken.current) {
      stopNote(noteToken.current)
      noteToken.current = null
    }
  }, [stopNote])

  const note = getNote()
  if (!note) return null
  const { frequency, octave } = note

  const pitch = Math.log2(frequency / baseFrequency)

  return frequency ? <>
    <PitchLine pitch={pitch} octave={octave} color="white" />
    <PitchButton frequency={frequency} isPlayable={false} />
  </> : null
}

export default MousePitch
