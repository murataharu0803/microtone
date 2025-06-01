import { useCallback, useEffect, useState } from 'react'

export type MousePosition = { x: number, y: number } | null

export const useMouse = (
  ref: React.RefObject<Element  | null> | null,
  onDown: () => void = () => void 0,
  onUp: () => void = () => void 0,
  onMove: () => void = () => void 0,
) => {
  const [position, setPosition] = useState<MousePosition>(null)

  const setMouseDown = useCallback(onDown, [onDown])
  const setMouseUp = useCallback(onUp, [onUp])
  const setMouseMove = useCallback((e: Event) => {
    onMove()
    const element = e as MouseEvent
    const target = element.currentTarget as Element
    if (!target) return
    const rect = target.getBoundingClientRect()
    const isLeave = e.type === 'mouseleave'
    setPosition(
      !isLeave ? {
        x: element.clientX - rect.left,
        y: element.clientY - rect.top,
      } : null,
    )
  }, [onMove])

  useEffect(() => {
    const refCurrent = ref?.current
    refCurrent?.addEventListener('mousedown', setMouseDown)
    refCurrent?.addEventListener('mouseup', setMouseUp)
    refCurrent?.addEventListener('mouseleave', setMouseUp)
    refCurrent?.addEventListener('mousemove', setMouseMove)
    return () => {
      refCurrent?.removeEventListener('mousedown', setMouseDown)
      refCurrent?.removeEventListener('mouseup', setMouseUp)
      refCurrent?.removeEventListener('mouseleave', setMouseUp)
      refCurrent?.removeEventListener('mousemove', setMouseMove)
    }
  }, [setMouseDown, setMouseUp, setMouseMove, ref])

  return { position }
}
