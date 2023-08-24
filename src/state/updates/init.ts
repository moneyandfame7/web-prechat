import type {GlobalState, SignalGlobalState} from 'types/state'
import {updateByKey} from 'utilities/object/updateByKey'

export type RootState = Pick<
  GlobalState,
  'initialization' | 'countryList' | 'notification' | 'newContact'
>

//  Object.assign(global, forUpd) // не втрачає ref, треба перевірити??
// перевірити підписки на властивості, або на сам обʼєкт
// проте відбувається rerender, бо ми оновлюємо сам обʼєкт а не властивість в ньому
export function updateRootState(global: SignalGlobalState, root: Partial<RootState>) {
  const {newContact, notification, ...justForUpdate} = root
  updateByKey(global, justForUpdate)

  if (newContact) {
    updateByKey(global.newContact, newContact)
  }
  if (notification) {
    updateByKey(global.notification, notification)
  }
}
