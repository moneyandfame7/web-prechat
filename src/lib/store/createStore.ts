import {deepSignal, type DeepSignal} from 'deepsignal'
import type {StoreActionHandlers, CreateStoreOptions, Store, Listener} from './types'
import {deepCopy} from 'utilities/object/deepCopy'
import {createActions} from './createActions'
import {deepUpdate} from 'utilities/object/deepUpdate'

/**
 * @todo Allow create not only objects, but and primitives.
 * @todo Action handlers with prepare and handler callbacks.
 */
export function createStore<
  State extends object,
  ActionHandlers extends StoreActionHandlers<State>,
  Name extends string = string
>(
  options: CreateStoreOptions<State, ActionHandlers, Name>
): Store<State, ActionHandlers, Name> {
  const {initialState, name, actionHandlers} = options

  const state = deepSignal(deepCopy(initialState))

  const subscribers = new Set<Listener<State>>()

  const actions = createActions(state as State, actionHandlers, subscribers)

  function setState(newState: Partial<State>) {
    try {
      // safeAssign(state, newState)
      // rewrite it, because state it's signal, but newState - plain obj
      deepUpdate(state, newState as Partial<DeepSignal<State>>)
      /* rewrite on signal??? */
      subscribers.forEach((cb) => cb(state as State))

      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  function subscribe(listener: (state: State) => void) {
    subscribers.add(listener)

    return () => {
      subscribers.delete(listener)
    }
  }

  return {
    getInitialState: () => initialState,
    getState: () => state,
    setState,
    subscribe,
    actions,
    caseActionHandlers: actionHandlers,
    name
  }
}
