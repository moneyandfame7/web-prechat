import { getGlobalState } from './signal'
import type { GlobalState, GlobalStateProperties } from 'types/state'

type EffectFor = keyof GlobalStateProperties

type EffectCallback<Name extends EffectFor> = (
  state: GlobalState,
  newValue: GlobalStateProperties[Name]
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
    callback(state, val as GlobalStateProperties[Name])
  })

  effects[name] = created
}

export function destroyEffect(name: EffectFor) {
  if (!effects[name]) {
    throw new Error(`❌ Effect with ${name} not found`)
  }
  effects[name]()
}
