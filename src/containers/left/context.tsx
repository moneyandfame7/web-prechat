import type {/* Key, */ VNode} from 'preact'
import {createContext} from 'preact'
import {useContext} from 'preact/hooks'

import type {LeftColumnStore} from 'types/ui'

const LeftColumnContext = createContext<LeftColumnStore | null>(null)

interface LeftColumnProviderProps {
  store: LeftColumnStore
  children: VNode
}
export function LeftColumnProvider(props: LeftColumnProviderProps) {
  return (
    <LeftColumnContext.Provider value={props.store}>
      {props.children}
    </LeftColumnContext.Provider>
  )
}
export function useLeftColumn() {
  const store = useContext(LeftColumnContext)
  if (!store) {
    throw new Error('LeftColumnStore used outside the provider')
  }

  return store
}
