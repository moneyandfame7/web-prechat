import {type TargetedEvent, useMemo} from 'preact/compat'

import {IS_SENSOR} from 'common/config'

export function useFastClick({
  fast = true,
  handler,
}: {
  fast?: boolean
  handler?: (e: TargetedEvent<HTMLDivElement, MouseEvent>) => void
}) {
  const handleMouseDown = (e: TargetedEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    if (e.button === 0) {
      handler?.(e)
    }
  }
  const onMouseDown = useMemo(() => {
    return fast && !IS_SENSOR ? handleMouseDown : undefined
  }, [fast, IS_SENSOR])

  const onClick = useMemo(() => {
    return IS_SENSOR || !fast ? handler : undefined
  }, [IS_SENSOR, fast])

  return {
    onMouseDown,
    onClick,
  }
}
