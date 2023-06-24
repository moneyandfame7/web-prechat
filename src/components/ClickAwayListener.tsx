import { VNode } from 'preact'
import { FC, useEffect, useRef } from 'preact/compat'

interface ClickAwayListenerProps {
  children: VNode
  onClickAway: VoidFunction
}
export const ClickAwayListener: FC<ClickAwayListenerProps> = ({ children, onClickAway }) => {
  const ref = useRef<HTMLDivElement>(null)
  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      onClickAway()
    } else {
      event.preventDefault()
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return <div ref={ref}>{children}</div>
}
