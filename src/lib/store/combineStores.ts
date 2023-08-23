import {computed} from '@preact/signals'
import type {
  AnyStore,
  CombinedStateForSet,
  CombinedStore,
  CombinedStoreProperty,
  GlobalListener,
  StoreListener,
  Unsubscribe,
  StoresMapObject
} from './types'

export function combineStores<S extends StoresMapObject>(stores: S): CombinedStore<S> {
  /**
   * @private
   */
  function getStoreProperty<P extends keyof AnyStore>(property: P) {
    return Object.keys(stores).reduce((acc, name: keyof S) => {
      const prop = stores[name][property]
      acc[name] = typeof prop === 'function' ? prop() : prop

      return acc
    }, {} as CombinedStoreProperty<S, P>)
  }

  function getActions() {
    return getStoreProperty('actions')
  }

  function getState() {
    return getStoreProperty('getState')
  }

  function getStringified() {
    return computed(() => JSON.stringify(getState()))
  }

  function getInitialState() {
    return getStoreProperty('getInitialState')
  }

  function getNames() {
    return getStoreProperty('name')
  }

  function setState(state: CombinedStateForSet<S>) {
    for (const key in state) {
      const toUpd = state[key]

      stores[key].setState(toUpd!)
    }
  }

  function resetState() {
    setState(getInitialState())
  }

  function subscribe<N extends keyof S>(
    name: N,
    listener: StoreListener<S, N>
  ): Unsubscribe
  function subscribe(listener: GlobalListener<S>): Unsubscribe
  function subscribe<N extends keyof S>(
    arg1: N | GlobalListener<S>,
    arg2?: StoreListener<S, N>
  ): Unsubscribe {
    let actualListener: GlobalListener<S> | StoreListener<S, N>

    if (typeof arg1 === 'string' && typeof arg2 === 'function') {
      actualListener = arg2
    } else if (typeof arg1 === 'function') {
      actualListener = arg1
    }
    const storesToSubscribe =
      /* idk how to fix it, so i use fuck ts :) */
      typeof arg1 === 'string' ? ({[arg1]: stores[arg1]} as unknown as S) : stores

    const unsubscribers = Object.keys(storesToSubscribe).map((name: keyof S) => {
      return storesToSubscribe[name].subscribe((state) => {
        actualListener(
          typeof arg1 === 'string'
            ? /* storesToSubscribe[name].getState() */ state
            : getState()
        )
      })
    })

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe())
    }
  }

  function select<Selected>(
    selector: (state: ReturnType<typeof getState>) => Selected
  ): Selected {
    return selector(getState())
  }

  return {
    getInitialState,
    getState,
    setState,
    resetState,
    getStringified,
    getActions,
    getNames,
    subscribe,
    select
  }
}
