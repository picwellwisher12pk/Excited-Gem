import { useState, useEffect } from 'react'

export function useResponsive() {
  const [isCompact, setIsCompact] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px)')

    // Set initial value
    setIsCompact(mediaQuery.matches)

    // Handler for changes
    const handler = (event: MediaQueryListEvent) => {
      setIsCompact(event.matches)
    }

    // Listen for changes
    mediaQuery.addEventListener('change', handler)

    return () => {
      mediaQuery.removeEventListener('change', handler)
    }
  }, [])

  return { isCompact }
}
