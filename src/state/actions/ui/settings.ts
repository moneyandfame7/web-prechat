import {createAction} from 'state/action'
import {changeMessageSize, toggleAnimations} from 'state/helpers/settings'
import {updateGeneralSettings, updateSettingsState} from 'state/updates'

import {changeTheme} from 'utilities/changeTheme'

createAction('changeTheme', (state, _, payload) => {
  changeTheme(payload)

  updateSettingsState(state, {
    general: {
      ...state.settings.general, // переробити хуйню цю
      theme: payload,
    },
    theme: payload,
  })
})

createAction('changeGeneralSettings', (state, _, payload) => {
  if (payload.animationsEnabled !== undefined) {
    toggleAnimations(payload.animationsEnabled)
  }
  if (payload.theme) {
    changeTheme(payload.theme)
  }
  if (payload.messageTextSize) {
    changeMessageSize(payload.messageTextSize)
  }
  console.log({payload})
  updateGeneralSettings(state, payload)
})
