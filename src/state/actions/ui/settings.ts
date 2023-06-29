import { createAction } from 'state/action'
import { PREFERRED_THEME } from 'state/helpers/settings'

createAction('changeTheme', (state, _, payload) => {
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
