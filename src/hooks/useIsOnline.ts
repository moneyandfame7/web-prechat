import {useEffect, useState} from 'preact/hooks'

export function useIsOnline() {
  const [isOnline, setIsOnline] = useState<boolean>(true)

  useEffect(() => {
    function handleChange() {
      setIsOnline(window.navigator.onLine)
    }
    window.addEventListener('offline', handleChange)
    window.addEventListener('online', handleChange)

    return () => {
      window.removeEventListener('offline', handleChange)
      window.removeEventListener('online', handleChange)
    }
  }, [])

  return isOnline
}
