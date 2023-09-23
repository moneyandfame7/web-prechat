import type {Theme} from 'types/state'

export function changeTheme(theme: Theme) {
  switch (theme) {
    case 'dark':
      document.documentElement.classList.add('night')
      break
    case 'light':
      document.documentElement.classList.remove('night')
      break
    case 'system': {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)')

      if (prefersDarkMode.matches) {
        document.documentElement.classList.add('night')
      } else {
        document.documentElement.classList.remove('night')
      }
    }
  }
}
