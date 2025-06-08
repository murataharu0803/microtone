import { useCallback, useEffect, useRef } from 'react'

export const useKey = (
  key: string,
  onDown: () => void = () => void 0,
  onUp: () => void = () => void 0,
) => {
  const isKeyDown = useRef(false)

  const setKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault() // Prevent default action for the key
    if (e.key === key && !e.repeat && !isKeyDown.current) {
      isKeyDown.current = true
      onDown()
    }
  }, [key, onDown])

  const forceKeyUp = useCallback(() => {
    if (isKeyDown.current) {
      onUp()
      isKeyDown.current = false
    }
  }, [isKeyDown, onUp])

  const setKeyUp = useCallback((e: KeyboardEvent) => {
    e.preventDefault() // Prevent default action for the key
    if (e.key === key) {
      onUp()
      isKeyDown.current = false
    }
  }, [key, onUp])

  useEffect(() => {
    document.addEventListener('keydown', setKeyDown)
    document.addEventListener('keyup', setKeyUp)
    window.addEventListener('blur', forceKeyUp)
    window.addEventListener('focus', forceKeyUp)
    return () => {
      document.removeEventListener('keydown', setKeyDown)
      document.removeEventListener('keyup', setKeyUp)
      window.removeEventListener('blur', forceKeyUp)
      window.removeEventListener('focus', forceKeyUp)
      isKeyDown.current = false // Reset state when removing listeners
    }
  }, [setKeyDown, setKeyUp, forceKeyUp])
}
