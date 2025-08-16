import React, { useState } from 'react'

import LadderChordIndicator from '@/components/ladder/LadderChordIndicator'
import LadderNoteIndicator from '@/components/ladder/LadderNoteIndicator'
import PitchLadderMouse from '@/components/ladder/PitchLadderMouse'
import PitchLadderSet from '@/components/ladder/PitchLadderSet'

import PitchLadderContext from '@/context/PitchLadderContext'
import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

import { useKey } from '@/hooks/useKey'

import { getOvertones } from '@/utils/overtones'

import Note from '@/types/Note'
import NoteClass from '@/types/NoteClass'
import Position from '@/types/Position'

interface PitchLadderProps {
  startPoint: Position
  endPoint: Position
  width: number
}

const PitchLadder: React.FC<PitchLadderProps> = ({
  startPoint,
  endPoint,
  width,
}) => {
  const {
    audioManager,
    baseFrequency,
    startPitch,
    endPitch,
    JIConstraint,
  } = React.useContext(PitchVisualizeSystemContext)
  const TET = 12

  const [isSnapped, setIsSnapped] = useState(true)
  const [snapToJI, setSnapToJI] = useState(false)

  useKey(
    'Shift',
    () => { setIsSnapped(false); audioManager?.stopAll() },
    () => { setIsSnapped(true); audioManager?.stopAll() },
  )

  useKey(
    'Control',
    () => { setSnapToJI(true); audioManager?.stopAll() },
    () => { setSnapToJI(false); audioManager?.stopAll() },
  )

  const octaves = Array.from(
    { length: Math.ceil(endPitch) - Math.floor(startPitch) + 1 },
    (_, i) => i + Math.floor(startPitch),
  )
  const JITones = getOvertones(JIConstraint).map(overtone => ({
    ...overtone,
    shrink: 0.05 * overtone.maxPrime,
  }))
  const TETTones = Array.from({ length: TET  }, (_, step) => ({
    noteClass: new NoteClass({ type: 'pitch', value: step / TET }),
    color: step ? '#888888' : 'white',
    shrink: step ? 0.2 : 0,
  }))

  const expandToAllPitches = (tones: { noteClass: NoteClass, color: string, shrink: number }[]) =>
    tones.map(tone =>
      octaves.map(octave => ({
        note: new Note({ baseFrequency, type: 'pitch', value: tone.noteClass.pitchClass + octave }),
        color: tone.color,
        shrink: tone.shrink,
      })).filter(tone => tone.note.pitch >= startPitch && tone.note.pitch <= endPitch),
    ).flat()

  const JIPitches = expandToAllPitches(JITones)
  const TETPitches = expandToAllPitches(TETTones)

  return <PitchLadderContext.Provider
    value={{ startPoint, endPoint, width }}
  >
    <g>
      <LadderNoteIndicator />
      <PitchLadderSet
        isPlayable={isSnapped && !snapToJI}
        pitches={TETPitches}
      />
      <PitchLadderSet
        isPlayable={isSnapped && snapToJI}
        pitches={JIPitches}
      />
      <LadderChordIndicator />
      {!isSnapped && <PitchLadderMouse />}
    </g>
  </PitchLadderContext.Provider>
}

export default PitchLadder
