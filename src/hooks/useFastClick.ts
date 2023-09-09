import {type TargetedEvent, useCallback, useMemo} from 'preact/compat'

import {IS_SENSOR} from 'common/config'

export function useFastClick({fast, handler}: {fast?: boolean; handler?: VoidFunction}) {
  const handleMouseDown = (e: TargetedEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault()
    if (e.button === 0) {
      handler?.()
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
