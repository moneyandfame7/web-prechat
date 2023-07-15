import { useEffect } from 'preact/compat'

type FocusHandler = (e: FocusEvent) => void

interface UseInactiveInput {
  onBlur: FocusHandler
  onFocus: FocusHandler
}

export const useInactivePage = (input: UseInactiveInput) => {
  useEffect(() => {
    const { onBlur, onFocus } = input

    window.addEventListener('blur', onBlur)
    window.addEventListener('focus', onFocus)

    return () => {
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('focus', onFocus)
    }
  }, [])
}
