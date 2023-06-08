import { createAction } from '../../action'
import { prefferedTheme } from './../../helpers/settings'

createAction('changeTheme', (state, payload) => {
  switch (payload) {
    case 'dark' || 'light':
      state.theme = payload
      break
    case 'system':
      state.theme = prefferedTheme
      break
  }
})

createAction('changeLanguage', (state, payload) => {
  state.language = payload
})

console.log('[ACTIONS]: Settings created 🤝')
