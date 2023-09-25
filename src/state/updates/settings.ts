import {storages} from 'state/storages'

import {updateByKey} from 'utilities/object/updateByKey'

import type {DeepPartial} from 'types/common'
import type {SettingsState, SignalGlobalState} from 'types/state'

// export function updateSettings(global:SignalGlobalState,){}

export function updateSettingsState(
  global: SignalGlobalState,
  settings: DeepPartial<SettingsState>
) {
  const {general, passcode, i18n, ...justToUpdate} = settings

  /* DOM helpers */

  /* UPDATES  */
  if (general) {
    updateByKey(global.settings.general, {
      ...general,
      animations: {
        ...global.settings.general.animations,
        ...general.animations,
      },
    })
  }
  if (passcode) {
    updateByKey(global.settings.passcode, passcode)
  }
  if (i18n) {
    updateByKey(global.settings.i18n, i18n.pack as any)
    global.settings.i18n.lang_code = i18n.lang_code!
  }

  updateByKey(global.settings, {
    ...justToUpdate,
    languages: [...global.settings.languages, ...((justToUpdate.languages || []) as any)],
  })
  storages.settings.put(global.settings) // ???? global.settings ???
}
