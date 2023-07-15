import { type VNode } from 'preact'
import { useCallback, useRef, useState } from 'preact/hooks'

import { cloneElementWithKey } from 'utilities/cloneElementWithKey'

type ScreenKey = string | number

interface UseScreenManagerInput<S extends ScreenKey> {
  cases: Record<S, VNode>
  initial: S
  forResetScreen?: S
  existScreen?: S
}
interface UseScreenManagerOutput<S extends ScreenKey> {
  setScreen: (screen: S) => void
  resetScreen: () => void
  renderScreen: () => VNode
  activeScreen: S
}

type UseScreenManagerHandler<
  S extends ScreenKey,
  N extends keyof UseScreenManagerOutput<S>
> = UseScreenManagerOutput<S>[N]

const useScreenManager = <S extends ScreenKey>(
  input: UseScreenManagerInput<S>
): UseScreenManagerOutput<S> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cache = useRef({} as Record<any, VNode>)
  const { cases, initial, forResetScreen = initial, existScreen } = input
  const [screen, setStateScreen] = useState(initial)

  const setScreen: UseScreenManagerHandler<S, 'setScreen'> = useCallback((screen) => {
    setStateScreen(screen)
  }, [])

  const resetScreen: UseScreenManagerHandler<S, 'resetScreen'> = useCallback(() => {
    setStateScreen(forResetScreen)
  }, [forResetScreen])

  const renderScreen: UseScreenManagerHandler<S, 'renderScreen'> = useCallback(() => {
    const computedScreen = existScreen || screen
    let Component = cache.current[computedScreen] || cases[computedScreen]
    if (!Component.key) {
      Component = cloneElementWithKey(Component, computedScreen)
      /* logDebugWarn('[UI]: Was cloned component and added key') */
    }

    if (!cache.current[computedScreen]) {
      /* хз навіщо, просто щоб не було завжди cloneElementWithKey */
      cache.current[computedScreen] = Component
    }

    // throw new Error('Key for Component in «useScreenManager» not provided')

    return Component
  }, [existScreen, screen])

  return {
    setScreen,
    resetScreen,
    renderScreen,
    activeScreen: existScreen || screen
  }
}

export { useScreenManager }
