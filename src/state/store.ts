/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Можливо колись розібʼю стейт на різні обʼєкти,
 * але поки що є один глобальний.
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

export const {getState} = test

export const {increment, changeMessage} = test.actions
