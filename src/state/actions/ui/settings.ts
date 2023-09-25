import {createAction} from 'state/action'
import {changeMessageSize, toggleAnimations} from 'state/helpers/settings'
import {storages} from 'state/storages'
import {updateSettingsState} from 'state/updates'

import {changeTheme} from 'utilities/changeTheme'
import {updateByKey} from 'utilities/object/updateByKey'

createAction('changeTheme', (state, _, payload) => {
  changeTheme(payload)

  updateSettingsState(state, {
    general: {
      theme: payload,
    },
  })
})

createAction('changeSettings', (state, _, payload) => {
  const {general, passcode, i18n} = payload

  /* DOM helpers */
  if (general?.animationsEnabled !== undefined) {
    toggleAnimations(general.animationsEnabled)
  }
  if (general?.theme) {
    changeTheme(general.theme)
  }
  if (general?.messageTextSize) {
    changeMessageSize(general.messageTextSize)
  }

  updateSettingsState(state, payload)
})
