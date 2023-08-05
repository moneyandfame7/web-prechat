import {type VNode, createContext} from 'preact'
import {useContext} from 'preact/hooks'

import type {Key} from 'types/ui'

export interface ScreenStore<TScreen extends Key> {
  resetScreen: (force?: boolean) => void
  activeScreen: TScreen
  setScreen: (screen: TScreen) => void
}
interface ScreenProviderProps<TScreen extends Key> {
  store: ScreenStore<TScreen>
  children: VNode
}

export function createScreenContext<TScreen extends Key, T extends object>(
  screens: T,
  name: string
) {
  const Context = createContext<ScreenStore<TScreen> | null>(null)

  const Provider = (props: ScreenProviderProps<TScreen>) => {
    return <Context.Provider value={props.store}>{props.children}</Context.Provider>
  }

  const useScreenContext = () => {
    const store = useContext(Context)
    if (!store) {
      throw new Error(`Cannot use store outside the «${name}Provider»`)
    }
    return store
  }

  const classNames = Object.keys(screens).reduce((obj, screen) => {
    obj[screen as TScreen] = `${name}-${screen}`

    return obj
  }, {} as Record<TScreen, string>)

  return {/* Context, */ Provider, useScreenContext, classNames}
}

// export function useScreenContext
