import { createAction } from 'state/global/action'

createAction('signUp', (state, { phoneNumber, language }) => {
  console.log('SIGN UP HAS BEEN CALLED', {
    phoneNumber,
    language,
    theme: state.theme
  })

  state.theme = state.theme === 'dark' ? 'light' : 'dark'
})

console.log('[ACTIONS]: Auth created 🤝')
