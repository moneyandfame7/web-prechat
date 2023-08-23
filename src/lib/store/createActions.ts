import {DEBUG} from 'common/config'
import type {StoreActionHandlers, Actions, Listener} from './types'

export function createActions<
  State extends object,
  ActionHandlers extends StoreActionHandlers<State>
>(state: State, actionHandlers: ActionHandlers, subscribers: Set<Listener<State>>) {
  const actionNames: (keyof ActionHandlers)[] = Object.keys(actionHandlers)

  return actionNames.reduce((actns, actionName: keyof ActionHandlers) => {
    actns[actionName] = ((payload: unknown) => {
      if (DEBUG) {
        // eslint-disable-next-line no-console
        console.log(`Action ${String(actionName)} was called`)
      }

      /* ми не повертаємо нічого, але ми тут хенлдимо проміс */
      const updatedState = actionHandlers[actionName](state, payload)

      // ?
      if (updatedState instanceof Promise) {
        return updatedState.then(() => {
          subscribers.forEach((cb) => {
            cb(state)
          })
          if (DEBUG) {
            // eslint-disable-next-line no-console
            console.log(`A$sync action ${String(actionName)} was called`)
          }
        })
      }

      subscribers.forEach((cb) => {
        cb(state)
      })
    }) as any
    /**
     * @todo fix this any
     */

    return actns
  }, {} as Actions<State, ActionHandlers>)
}
