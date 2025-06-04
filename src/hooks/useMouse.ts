import { useCallback, useEffect } from 'react'

export type MousePosition = { x: number, y: number } | null

export const useMouse = (
  ref: React.RefObject<Element  | null> | null,
  onDown: () => void = () => void 0,
  onUp: () => void = () => void 0,
  onMove: (isPressed: boolean) => void = () => void 0,
) => {
  // const position = useRef<MousePosition>(null)

  const setMouseDown = useCallback(onDown, [onDown])
  const setMouseUp = useCallback(onUp, [onUp])
  const setMouseMove = useCallback((e: Event) => {
    const event = e as MouseEvent
    onMove(event.buttons > 0)
    // const target = event.currentTarget as Element
    // if (!target) return
    // const rect = target.getBoundingClientRect()
    // const isLeave = e.type === 'mouseleave'
    // // position.current = !isLeave ? {
    //   x: event.clientX - rect.left,
    //   y: event.clientY - rect.top,
    // } : null
  }, [onMove])
  const setMouseLeave = useCallback(
    (e: Event) => { if ((e as MouseEvent).buttons > 0) onUp() },
    [onUp],
  )

  useEffect(() => {
    const refCurrent = ref?.current
    refCurrent?.addEventListener('mousedown', setMouseDown)
    refCurrent?.addEventListener('mouseup', setMouseUp)
    refCurrent?.addEventListener('mouseleave', setMouseLeave)
    refCurrent?.addEventListener('mousemove', setMouseMove)
    return () => {
      refCurrent?.removeEventListener('mousedown', setMouseDown)
      refCurrent?.removeEventListener('mouseup', setMouseUp)
      refCurrent?.removeEventListener('mouseleave', setMouseLeave)
      refCurrent?.removeEventListener('mousemove', setMouseMove)
    }
  }, [setMouseDown, setMouseUp, setMouseMove, ref, setMouseLeave])

  // return { position }
}
