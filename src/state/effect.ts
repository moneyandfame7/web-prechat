import { getGlobalState } from './signal'
import type { GlobalState, SignalGlobalState } from 'types/state'

type EffectFor = keyof GlobalState

type EffectCallback<Name extends EffectFor> = (
  state: SignalGlobalState,
  newValue: SignalGlobalState[Name]
) => void
type EffectUnsubscribe = () => void
type Effects = Record<EffectFor, EffectUnsubscribe>

const effects = {} as Effects

export function createEffect<Name extends EffectFor>(name: Name, callback: EffectCallback<Name>) {
  if (effects[name]) {
    throw new Error(`❌ Effect for ${name} already exist`)
  }
  const state = getGlobalState()
  const created = state[`$${name}`]!.subscribe((val) => {
    callback(state, val as GlobalState[Name])
  })

  effects[name] = created
}

export function destroyEffect(name: EffectFor) {
  if (!effects[name]) {
    throw new Error(`❌ Effect with ${name} not found`)
  }
  effects[name]()
}
