import React, { useContext, useEffect } from 'react'

import PitchLadderLineLine from '@/components/ladder/PitchLadderLineLine'

import PitchVisualizeSystemContext from '@/context/PitchVisualizeSystemContext'

import { uniqueArray } from '@/utils/math'

import LadderInterval from '@/components/ladder/LadderInterval'
import Axis, { getFactorFromDimensions } from '@/types/Axis'
import Note from '@/types/Note'

const ERROR = 0.000001

type Interval = {
  lowPitch: number
  hiPitch: number
  dimension: number
  reverse: boolean
}

const constructIntervals = (dimensions: number[], axis: Axis[], basePitch = 0, base = false) => {
  const axisFactors = axis.map(a => a.factor)
  const order = base ? [2, 3, 4, 5, 6] : [1, 2, 3, 4, 5, 6]
  let curPitch = base ? basePitch + dimensions[0] : basePitch
  const intervals: Interval[] = []
  const pitches: number[] = [curPitch]
  for (const di of order) {
    const dn = dimensions[di - 1] || 0
    for (let p = 0; p < Math.abs(dn); p++) {
      let lowPitch = curPitch
      let hiPitch = lowPitch + Math.log2(axisFactors[di - 1]) * (dn < 0 ? -1 : 1)
      const targetPitch = hiPitch
      if (hiPitch < lowPitch) [hiPitch, lowPitch] = [lowPitch, hiPitch]
      intervals.push({
        lowPitch,
        hiPitch,
        dimension: di,
        reverse: base,
      })
      curPitch = targetPitch
      pitches.push(targetPitch)
    }
  }
  return { intervals, pitches }
}

const compareIntervals = (a: Interval, b: Interval) =>
  Math.abs(a.lowPitch - b.lowPitch) < ERROR
    && Math.abs(a.hiPitch - b.hiPitch) < ERROR
    && a.dimension === b.dimension

const LadderChordIndicator: React.FC = () => {
  const { audioManager, baseFrequency } = useContext(PitchVisualizeSystemContext)
  const { axis } = useContext(PitchVisualizeSystemContext)

  const [dimensions, setDimensions] = React.useState<number[][]>([])

  useEffect(() => {
    const removeSubscription = audioManager?.subscribe(
      () => setDimensions(audioManager?.dimensionsList || []),
    )
    return () => { removeSubscription?.() }
  }, [audioManager])

  if (!dimensions.length) return null

  const pitches = dimensions.map(d => Math.log2(getFactorFromDimensions(d, axis)))

  const baseDimension = dimensions.length ? dimensions.reduce(
    (acc, d) => acc.map((a, i) => Math.min(a, d[i])),
    dimensions[0],
  ) : []
  const baseFactor = getFactorFromDimensions(baseDimension, axis)
  const baseIntervals = constructIntervals(baseDimension, axis, 0, true)
  const basePitch = Math.log2(baseFactor)

  const relativeDimensions = dimensions.map(d => d.map((dim, i) => dim - baseDimension[i]))
  const relativeIntervals = relativeDimensions.map(
    d => constructIntervals(d, axis, basePitch),
  )

  const relativeIntervalValues = relativeIntervals.map(i => i.intervals).flat()
  const intervals = [...baseIntervals.intervals, ...relativeIntervalValues]
  const uniqueIntervals = uniqueArray(intervals, compareIntervals)
  uniqueIntervals.forEach(interval => {
    const reverse = !relativeIntervalValues.find(i => compareIntervals(i, interval))
    interval.reverse = reverse
  })

  if (dimensions.length)console.log(relativeIntervalValues, uniqueIntervals)

  const passingPitches = [...baseIntervals.pitches, ...relativeIntervals.map(i => i.pitches).flat()]
  const uniquePitches = uniqueArray(passingPitches, (a, b) => Math.abs(a - b) < ERROR)
  const nonActivePitches =
    uniquePitches.filter(pitch => !pitches.find(p => Math.abs(p - pitch) < ERROR))

  return <g>
    {uniqueIntervals.map((interval, index) => <LadderInterval key={index} {...interval} />)}
    {nonActivePitches.map((pitch, index) =>
      <PitchLadderLineLine
        key={`${index}-${pitch}`}
        note={new Note({ baseFrequency, type: 'pitch', value: pitch })}
        color="white"
        width={2}
        shrink={-0.2}
        dashed
      />,
    )}
  </g>
}

export default LadderChordIndicator
