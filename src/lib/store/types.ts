/* eslint-disable @typescript-eslint/no-explicit-any */
import type {DeepSignal} from 'deepsignal'
import type {ReadonlySignal} from '@preact/signals'
import type {AnyFunction} from 'types/common'

export type StoreActionHandlers<State> = {
  [K: string]: StoreActionHandler<State>
}

export type StoreActionHandler<State> = (
  state: State,
  payload: any
) => void | Promise<void>

export type ActionWithoutPayload = (noArgument: void) => void

export type ActionWithPayload<P> = (payload: P) => void

export type ActionHandlerPayload<
  State,
  ActionHandler extends StoreActionHandler<State>
> = Parameters<ActionHandler>[1]

export type Listener<State> = (state: State) => void
export type Unsubscribe = VoidFunction
export type Subscribe<State> = (listener: Listener<State>) => Unsubscribe

export type ActionAsyncWithPayload<P> = (payload: P) => Promise<void>
export type ActionAsyncWithoutPayload = (noArgumend: void) => Promise<void>

export type Action<ActionHandler extends AnyFunction, Payload> = Payload extends undefined
  ? ReturnType<ActionHandler> extends Promise<void>
    ? ActionAsyncWithoutPayload
    : ActionWithoutPayload
  : ReturnType<ActionHandler> extends Promise<void>
  ? ActionAsyncWithPayload<Payload>
  : ActionWithPayload<Payload>

export type Actions<State, ActionHandlers extends StoreActionHandlers<State>> = {
  [key in keyof ActionHandlers]: Action<
    ActionHandlers[key],
    ActionHandlerPayload<State, ActionHandlers[key]>
  >
}

export interface CreateStoreOptions<
  State,
  ActionHandlers extends StoreActionHandlers<State>,
  Name
> {
  /**
   * The store name.
   */
  name: Name
  /**
   * The store initial state.
   */
  initialState: State
  /**
   * Rewrite with prepare and handler callback.
   */
  actionHandlers: ActionHandlers

  // /**
  //  * Reducers, in which will be called listeners.
  //  * Only update state, without business logic.
  //  */
  // reducers?: Reducers
  // middleware?: Middleware<State, keyof ActionHandlers>[]
}

export interface Store<
  State,
  ActionHandlers extends StoreActionHandlers<State>,
  Name extends string = string
  // Reducers extends StoreReducers<State> = StoreReducers<State>,
> {
  /**
   *
   * @returns current signal state.
   */
  getState: () => DeepSignal<State>
  setState: (newState: Partial<State>) => void
  getInitialState: () => State
  subscribe: Subscribe<State>
  actions: Actions<State, ActionHandlers>
  caseActionHandlers: ActionHandlers
  // caseReducers?: Reducers
  name: Name
  /* stateInitialization? */
}

export type AnyStore = Store<any, any, string>
export type CombinedStateForSet<S extends StoresMapObject> = {
  [K in keyof S]?: Parameters<S[K]['setState']>[0]
}
/** COMBINED_STORE */
export type CombinedStore<S extends StoresMapObject> = {
  getInitialState: () => CombinedStoreProperty<S, 'getInitialState'>
  getState: () => CombinedStoreProperty<S, 'getState'>
  getActions: () => CombinedStoreProperty<S, 'actions'>
  getNames: () => CombinedStoreProperty<S, 'name'>
  getStringified: () => ReadonlySignal<string>
  resetState: () => void
  setState: (state: CombinedStateForSet<S>) => void
  /**
   * Can subscribe on one store or global.
   * @param name The name of the store you want to subscribe to.
   * @param listener A callback to be invoked on every action.
   * @returns A function to remove this change listener.
   */
  subscribe<N extends keyof S>(name: N, listener: StoreListener<S, N>): Unsubscribe
  subscribe(listener: GlobalListener<S>): Unsubscribe

  select<Selected>(
    selector: (state: CombinedStoreProperty<S, 'getState'>) => Selected
  ): Selected
}
export type StoresMapObject = {
  [key: string]: AnyStore
}

/**
 * дістаємо по мапу сторів їх властивості.
 */
export type CombinedStoreProperty<
  S extends StoresMapObject,
  Property extends keyof AnyStore
> = {
  [K in keyof S]: S[K][Property] extends AnyFunction
    ? ReturnType<S[K][Property]>
    : S[K][Property]
}

export type GlobalListener<S extends StoresMapObject> = (
  state: CombinedStoreProperty<S, 'getState'>
) => void
export type StoreListener<T extends StoresMapObject, N extends keyof T> = (
  state: ReturnType<T[N]['getState']>
) => void

export type Middleware<S extends object, A extends StoreActionHandlers<S>> = (
  // store: Store<S, A>,
  state: S
) => (
  next: (action: keyof A, payload: unknown) => void
) => (action: keyof A, payload: unknown) => void
