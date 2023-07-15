import { VNode, createContext } from 'preact'
import { useContext } from 'preact/hooks'

import type { LeftColumnStore } from 'types/ui'

const LeftColumnContext = createContext<LeftColumnStore | null>(null)

interface LeftColumnProviderProps {
  store: LeftColumnStore
  children: VNode
}
export function LeftColumnProvider(props: LeftColumnProviderProps) {
  return (
    <LeftColumnContext.Provider value={props.store}>{props.children}</LeftColumnContext.Provider>
  )
}
export function useLeftColumn(): LeftColumnStore
export function useLeftColumn<R>(selector: (store: LeftColumnStore) => R): R
export function useLeftColumn<R>(selector?: (store: LeftColumnStore) => R) {
  const store = useContext(LeftColumnContext)
  if (!store) {
    throw new Error('LeftColumnStore used outside the provider')
  }
  if (typeof selector === 'function') {
    return selector(store)
  }

  return store
}
