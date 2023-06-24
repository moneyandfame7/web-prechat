import { createAction } from 'state/action'

createAction('setAuthRememberMe', (state, payload) => {
  state.auth.rememberMe = Boolean(payload)
})

createAction('changeAuthScreen', (state, payload) => {
  state.auth.screen = payload
})
