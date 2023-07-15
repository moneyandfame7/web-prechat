import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks'

import { debounce } from 'common/functions'

interface UseResizeProps {
  initialWidth?: number
  maxWidth: number
  minWidth: number
  debounceCb: (width: number) => void
}

export function useResize<T extends HTMLElement>({
  initialWidth,
  debounceCb,
  minWidth,
  maxWidth
}: UseResizeProps) {
  const [isResizing, setIsResizing] = useState(false)
  const [width, setWidth] = useState(initialWidth)
  const ref = useRef<T>(null)

  const resize = useCallback(() => {
    setIsResizing(true)
  }, [])

  const stopResizing = useCallback(() => {
    setIsResizing(false)
  }, [])

  const debounceResize = useMemo(() => {
    return debounce(debounceCb, 500)
  }, [])

  const eventResize = useCallback(
    (e: MouseEvent) => {
      if (isResizing && ref.current) {
        const width = e.clientX - ref.current.getBoundingClientRect().left
        if (width > minWidth && width < maxWidth) {
          setWidth(width)
          debounceResize(width)
        }
      }
    },
    [isResizing]
  )
  useEffect(() => {
    window.addEventListener('mousemove', eventResize)
    window.addEventListener('mouseup', stopResizing)
    return () => {
      window.removeEventListener('mousemove', eventResize)
      window.removeEventListener('mouseup', stopResizing)
    }
  }, [eventResize, stopResizing])

  return {
    resize,
    width,
    ref
  }
}
