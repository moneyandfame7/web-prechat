import {createAction} from 'state/action'
import {updateSettingsState} from 'state/updates'

createAction('changeTheme', (state, _, payload) => {
  updateSettingsState(state, {
    general: {
      ...state.settings.general, // переробити хуйню цю
      theme: payload,
    },
    theme: payload,
  })
})
