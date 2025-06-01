import React, { useContext } from 'react'

import Pitch from '@/components/Pitch'
import { PitchCircleContext } from '@/components/PitchCircle'
import { SVGContext } from '@/components/SVGWithContext'

import { useAudio } from '@/hooks/useAudio'
import { useMouse } from '@/hooks/useMouse'

const MousePitch: React.FC = () => {
  const { mousePosition, SVGRef } = useContext(SVGContext)
  const {
    baseFrequency,
    radius,
    center,
    octaveShiftRef,
  } = useContext(PitchCircleContext)


  const getFrequency = () => {
    if (!mousePosition) return null

    const distanceToCenter = Math.sqrt(
      Math.pow(mousePosition.x - center.x, 2) +
      Math.pow(mousePosition.y - center.y, 2),
    )
    const isInsideCircle = distanceToCenter <= radius && distanceToCenter > 0
    if (!isInsideCircle) return null

    const extendedPosition = {
      x: center.x + (mousePosition!.x - center.x) * (radius / distanceToCenter!),
      y: center.y + (mousePosition!.y - center.y) * (radius / distanceToCenter!),
    }
    const mouseAngle =
      Math.atan2(extendedPosition.y - center.y, extendedPosition.x - center.x) + 5 * Math.PI / 2
    const mouseFrequency = baseFrequency * Math.pow(
      2,
      (mouseAngle! % (2 * Math.PI)) / (2 * Math.PI) + octaveShiftRef!.current,
    )

    return mouseFrequency
  }

  const { playTone, stopTone, changeTone } = useAudio()
  const playMouseTone = () => {
    const frequency = getFrequency()
    console.log('playMouseTone frequency', frequency)
    if (frequency) playTone(frequency)
  }

  const stopMouseTone = () => {
    stopTone()
  }

  const changeMouseTone = () => {
    const frequency = getFrequency()
    console.log('changeMouseTone frequency', frequency)
    if (frequency) changeTone(frequency)
  }

  useMouse(SVGRef, playMouseTone, stopMouseTone, changeMouseTone)

  return getFrequency() ? <Pitch show={true} frequency={getFrequency()!} /> : null
}

export default MousePitch
