import { getGlobalState } from './signal'

function initializeSettings() {
  const state = getGlobalState()
  switch (state.theme) {
    case 'dark':
      document.documentElement.classList.add('dark')
      break
    case 'light':
      document.documentElement.classList.remove('dark')
      break
  }
}

export function initializeGlobalState() {
  console.log('INITIALIZE')
  initializeSettings()
}
