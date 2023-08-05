import type {GlobalState, SignalGlobalState} from 'types/state'
import {updateByKey} from 'utilities/object/updateByKey'

export type RootState = Pick<
  GlobalState,
  'initialization' | 'countryList' | 'notification'
>

//  Object.assign(global, forUpd) // не втрачає ref, треба перевірити??
// проте відбувається rerender, бо ми оновлюємо сам обʼєкт а не властивість в ньому
export function updateRootState(global: SignalGlobalState, root: RootState) {
  updateByKey(global, root)
}
