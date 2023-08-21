/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Можливо колись розібʼю стейт на різні обʼєкти,
 * але наразі лише один глобальний.
 * ( цей store просто для навчальних цілей, поки що не
 *  збираюсь  його ніяк використовувати )
 */

import {type DeepSignal, deepSignal} from 'deepsignal'

type StoreReducers<State> = {
  [K: string]: StoreReducer<State>
}

type StoreReducer<State> = (state: State, payload: any) => void

type ActionWithoutPayload = (noArgument: void) => void

type ActionWithPayload<P> = (payload: P) => void

type ReducerPayload<State, Reducer extends StoreReducer<State>> = Parameters<Reducer>[1]

type StoreAction<Payload> = Payload extends undefined
  ? ActionWithoutPayload
  : ActionWithPayload<Payload>

type StoreActions<State, Reducers extends StoreReducers<State>> = {
  [key in keyof Reducers]: StoreAction<ReducerPayload<State, Reducers[key]>>
}

type StoreOptions<State, Reducers> = {
  initialState: State
  reducers: Reducers
}

type Store<State, Reducers extends StoreReducers<State>> = {
  initialState: State
  actions: StoreActions<State, Reducers>
  getState: () => DeepSignal<State>
  getParsedState: () => State
}

function createActions<State extends object, Reducers extends StoreReducers<State>>(
  state: State,
  reducers: Reducers
) {
  return Object.keys(reducers).reduce((actns, reducerName: keyof Reducers) => {
    actns[reducerName] = ((payload: unknown) => {
      console.log(`Reducer will be called - [${String(reducerName)}]`)

      const updatedState = reducers[reducerName](state, payload)

      console.log('Reducer return result: ', updatedState)
    }) as any

    return actns
  }, {} as StoreActions<State, Reducers>)
}

function testStore<State extends object, Reducers extends StoreReducers<State>>({
  reducers,
  initialState
}: StoreOptions<State, Reducers>): Store<State, Reducers> {
  const state = deepSignal(initialState)

  return {
    initialState,
    actions: createActions(state as State, reducers),
    getParsedState: () => JSON.parse(JSON.stringify(state)) as State,
    getState: () => state
  }
}

const test = testStore({
  reducers: {
    increment: (state) => {
      state.counter += 1
    },
    changeMessage: (state, payload: string) => {
      state.message = payload
    }
  },
  initialState: {
    message: '',
    counter: 0
  }
})

// type CombinedStores<T extends Record<keyof T, Store<any, any>>> = {
//   [K in keyof T]: ReturnType<T[K]['getState']>
// }

type CombinedStoreOptions = {
  [K in string]: Store<any, any>
}
type CombinedStoreState<T extends CombinedStoreOptions> = {
  [K in keyof T]: ReturnType<T[K]['getState']>
}
type CombinedStoreParsedState<T extends CombinedStoreOptions> = {
  [K in keyof T]: ReturnType<T[K]['getParsedState']>
}
export function combineStores<T extends CombinedStoreOptions>(stores: T) {
  function getState() {
    return Object.keys(stores).reduce((acc, name: keyof T) => {
      acc[name] = stores[name].getState() /* as ReturnType<T[keyof T]['getState']> */

      return acc
    }, {} as CombinedStoreState<T>)
  }

  function getParsedState() {
    return Object.keys(stores).reduce((acc, name: keyof T) => {
      acc[name] = stores[name].getParsedState()

      return acc
    }, {} as CombinedStoreParsedState<T>)
  }
  return {
    getState,
    getParsedState
  }
}

const rootStore = combineStores({
  test
})

type SignalRootState = ReturnType<typeof rootStore.getState>
type RootState = ReturnType<typeof rootStore.getParsedState>

export const {getState} = test

export const {increment, changeMessage} = test.actions
