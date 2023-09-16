import {createAction} from 'state/action'
import {updateSettingsState} from 'state/updates'

// import {PREFERRED_THEME} from 'state/helpers/settings'

createAction('changeTheme', (state, _, payload) => {
  updateSettingsState(state, {
    general: {
      ...state.settings.general,
      theme: payload,
    },
    theme: payload,
  })
  switch (payload) {
    case 'dark':
      document.documentElement.classList.add('night')
      break
    case 'light':
      document.documentElement.classList.remove('night')
      break
  }
})
