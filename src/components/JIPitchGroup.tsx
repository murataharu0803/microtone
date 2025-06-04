import React, { useContext } from 'react'

import { PitchCircleContext } from '@/components/PitchCircle'
import { PitchLine } from '@/components/PitchLine'

import Note from '@/utils/Note'
import { findFurthest } from '@/utils/math'
import { getOvertones } from '@/utils/prime'

interface JIPitchGroupProps {
  triggerKeys?: string[]
}

const JIPitchGroup: React.FC<JIPitchGroupProps> = () => {
  const { JIConstraint, baseFrequency, startPitch, endPitch } = useContext(PitchCircleContext)

  const tones = getOvertones(JIConstraint)
  const octaves = Array.from(
    { length: Math.ceil(endPitch) - Math.floor(startPitch) + 1 },
    (_, i) => i + Math.floor(startPitch),
  )

  return <g>
    {tones.map(tone => {
      const notes = octaves.map(octave => new Note({
        baseFrequency,
        type: 'pitch',
        value: tone.noteClass.pitchClass + octave,
      }))
      const highestNote = findFurthest(
        notes.filter(note => note.pitch >= startPitch && note.pitch <= endPitch),
        note => note.pitch,
      )
      return <PitchLine
        key={highestNote.pitch}
        note={highestNote}
        color={tone.color}
      />
    })}
  </g>
}

export default JIPitchGroup
