import { createAction } from '../../action'
import { prefferedTheme } from './../../helpers/settings'

createAction('changeTheme', (state, payload) => {
  switch (payload) {
    case 'dark':
      state.theme = payload
      document.documentElement.classList.add('dark')
      break
    case 'light':
      state.theme = payload
      document.documentElement.classList.remove('dark')
      break
    case 'system':
      state.theme = prefferedTheme
      break
  }
})

createAction('changeLanguage', (state, payload) => {
  state.language = payload
})
