import { ComponentChildren, createContext } from 'preact'
import { useContext } from 'preact/hooks'

import type { LeftColumnMainStore } from 'types/ui'

const LeftColumnMainContext = createContext<LeftColumnMainStore | null>(null)

interface LeftColumnMainProviderProps {
  store: LeftColumnMainStore
  children: ComponentChildren
}
export function LeftColumnMainProvider(props: LeftColumnMainProviderProps) {
  return (
    <LeftColumnMainContext.Provider value={props.store}>
      {props.children}
    </LeftColumnMainContext.Provider>
  )
}
export function useLeftMainColumn(): LeftColumnMainStore
export function useLeftMainColumn<R>(selector: (store: LeftColumnMainStore) => R): R
export function useLeftMainColumn<R>(selector?: (store: LeftColumnMainStore) => R) {
  const store = useContext(LeftColumnMainContext)
  if (!store) {
    throw new Error('LeftColumnMainStore used outside the provider')
  }
  if (typeof selector === 'function') {
    return selector(store)
  }

  return store
}
