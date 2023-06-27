import { createAction } from '../../action'
import { PREFERRED_THEME } from './../../helpers/settings'

createAction('changeTheme', (state, payload) => {
  switch (payload) {
    case 'dark':
      state.settings.theme = payload
      document.documentElement.classList.add('dark')
      break
    case 'light':
      state.settings.theme = payload
      document.documentElement.classList.remove('dark')
      break
    case 'system':
      state.settings.theme = PREFERRED_THEME
      break
  }
})
