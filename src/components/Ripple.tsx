import {type FC, type TargetedEvent, memo, useCallback, useMemo, useState} from 'preact/compat'

import {debounce} from 'common/functions'

import './Ripple.scss'

const ANIMATION_DURATION_MS = 700

export const Ripple: FC = memo(() => {
  const [ripples, setRipples] = useState<{x: number; y: number; size: number}[]>([])
  const cleanUpDebounced = useMemo(() => {
    return debounce(
      () => {
        setRipples([])
      },
      ANIMATION_DURATION_MS,
      false
    )
  }, [])
  const handleMouseDown = useCallback(
    (e: TargetedEvent<HTMLDivElement, MouseEvent>) => {
      if (e.button !== 0 && e.button !== 2) {
        return
      }

      const container = e.currentTarget
      const position = container.getBoundingClientRect()
      const rippleSize = container.offsetWidth / 2

      setRipples((ripples) => [
        ...ripples,
        {
          x: e.clientX - position.x - rippleSize / 2,
          y: e.clientY - position.y - rippleSize / 2,
          size: rippleSize,
        },
      ])

      // setLastRippleIdx(ripples.length) // оновити індекс

      cleanUpDebounced()
    },
    [ripples]
  )

  return (
    <div class="ripple-container" onMouseDown={handleMouseDown}>
      {ripples.map(({x, y, size}, idx) => (
        <span
          key={idx}
          style={`left: ${x}px; top: ${y}px; width: ${size}px; height: ${size}px;`}
        />
      ))}
    </div>
  )
})
