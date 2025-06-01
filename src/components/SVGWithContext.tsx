import React, { createContext, useCallback, useState } from 'react'

import { MousePosition } from '@/hooks/useMouse'

const SVGContext = createContext<{
  mousePosition: MousePosition
  SVGRef: React.RefObject<SVGSVGElement | null> | null
}>({ mousePosition: null, SVGRef: null })

const SVGWithContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [position, setPosition] = useState<MousePosition>(null)
  const SVGRef = React.useRef<SVGSVGElement>(null)

  const onMouseEvent = useCallback((e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const isLeave = e.type === 'mouseleave'
    setPosition(
      !isLeave ? {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      } : null,
    )
  }, [])

  return <svg
    width="1000"
    height="1000"
    viewBox="0 0 1000 1000"
    onMouseMove={onMouseEvent}
    onMouseLeave={onMouseEvent}
    ref={SVGRef}
  >
    <SVGContext.Provider value={{ mousePosition: position, SVGRef }}>
      {children}
    </SVGContext.Provider>
  </svg>
}

export default SVGWithContext
export { SVGContext }
