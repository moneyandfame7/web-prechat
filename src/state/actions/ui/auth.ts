import { createAction } from 'state/action'

createAction('setAuthRememberMe', (state, payload) => {
  state.auth.rememberMe = Boolean(payload)
})
