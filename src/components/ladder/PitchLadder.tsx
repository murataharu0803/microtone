import React, { createContext, useState } from 'react'

import LadderNoteIndicator from '@/components/ladder/LadderNoteIndicator'
import PitchLadderMouse from '@/components/ladder/PitchLadderMouse'
import PitchLadderSet from '@/components/ladder/PitchLadderSet'
import { PitchVisualizeSystemContext } from '@/components/PitchVisualizeSystem'

import { useKey } from '@/hooks/useKey'

import Note, { NoteClass } from '@/utils/Note'
import { getOvertones } from '@/utils/prime'

interface PitchLadderProps {
  startPoint: { x: number, y: number }
  endPoint: { x: number, y: number }
  width: number
}

const PitchLadderContext = createContext<PitchLadderProps>({
  startPoint: { x: 1720, y: 100 },
  endPoint: { x: 1720, y: 980 },
  width: 150,
})

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
    () => { setIsSnapped(false); audioManager.current?.stopAll() },
    () => { setIsSnapped(true); audioManager.current?.stopAll() },
  )

  useKey(
    'Control',
    () => { setSnapToJI(true); audioManager.current?.stopAll() },
    () => { setSnapToJI(false); audioManager.current?.stopAll() },
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
      {!isSnapped && <PitchLadderMouse />}
    </g>
  </PitchLadderContext.Provider>
}

export default PitchLadder
export { PitchLadderContext }
