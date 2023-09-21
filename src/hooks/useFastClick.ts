import {type TargetedEvent, useMemo} from 'preact/compat'

import {IS_SENSOR} from 'common/environment'

import type {AnyFunction} from 'types/common'

export function useFastClick<T extends AnyFunction>(handler?: T, fast = true) {
  const handleMouseDown = (e: TargetedEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault()
    if (e.button === 0) {
      handler?.(e)
    }
  }
  const onMouseDown = useMemo(() => {
    return fast && !IS_SENSOR ? (handleMouseDown as unknown as T) : undefined
  }, [fast, IS_SENSOR, handler])

  const onClick = useMemo(() => {
    return IS_SENSOR || !fast ? (handler as unknown as T) : undefined
  }, [IS_SENSOR, fast, handler])

  return {
    onMouseDown,
    onClick,
  }
}
