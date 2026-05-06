import PitchLadderInterval from '@/components/ladder/PitchLadderInterval'
import PitchLadderLine from '@/components/ladder/PitchLadderLine'
import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

import { usePlayingJINotes } from '@/hooks/usePlayingJINotes'
import Note from '@/types/Note'
import { DIMENSION_FACTOR } from '@/utils/dimension'
import { useContext } from 'react'

const PitchLadderChordDiagram: React.FC = () => {
  const { baseFrequency } = useContext(PitchVisualizeSystemContext)

  const { intervals, jiNotes } = usePlayingJINotes()

  const intervalData = intervals.slice(1).map(interval => {
    const startPitch = Math.log2(interval.baseFactor)
    const direction = interval.direction === 'up' ? 1 : -1
    const pitchChange = Math.log2(DIMENSION_FACTOR[interval.dimension]) * direction
    const endPitch = startPitch + pitchChange
    return { startPitch, endPitch, dimension: interval.dimension }
  })

  const middlePitches = intervals.filter(i => !i.hasNote).map(i => Math.log2(i.factor))

  return <g
    fontSize="10"
    fill="white"
    textAnchor="middle"
  >
    {jiNotes.length && middlePitches.map(pitch =>
      <PitchLadderLine
        key={`dashed-${pitch}`}
        note={new Note({ baseFrequency, value: pitch, type: 'pitch' })}
        color="white"
        dash
      />,
    )}
    {intervalData.map(interval => <PitchLadderInterval
      key={`${interval.startPitch}-${interval.endPitch}-${interval.dimension}`}
      {...interval}
    />)}
  </g>
}

export default PitchLadderChordDiagram
