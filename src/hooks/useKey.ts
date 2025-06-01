import { useCallback, useEffect, useState } from 'react'

export const useKey = (key: string, onDown: () => void, onUp: () => void) => {
  const [isKeyDown, setIsKeyDown] = useState(false)

  const trigger = useCallback((newKeyDown: boolean) => {
    if (newKeyDown && !isKeyDown) {
      setIsKeyDown(true)
      onDown()
    } else if (!newKeyDown && isKeyDown) {
      setIsKeyDown(false)
      onUp()
    }
  }, [onDown, onUp, isKeyDown])

  const setKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === key && !e.repeat) {
      trigger(true)
      setIsKeyDown(true)
    }
  }, [key, trigger])

  const forceKeyUp = useCallback(() => {
    setIsKeyDown(false)
    onUp()
  }, [onUp])

  const setKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === key) forceKeyUp()
  }, [key, forceKeyUp])

  useEffect(() => {
    // Initial state check
    document.addEventListener('keydown', setKeyDown)
    document.addEventListener('keyup', setKeyUp)
    window.addEventListener('blur', forceKeyUp)
    window.addEventListener('focus', forceKeyUp)
    return () => {
      document.removeEventListener('keydown', setKeyDown)
      document.removeEventListener('keyup', setKeyUp)
      window.removeEventListener('blur', forceKeyUp)
      window.removeEventListener('focus', forceKeyUp)
      setIsKeyDown(false) // Reset state when removing listeners
    }
  }, [setKeyDown, setKeyUp, forceKeyUp])
}
