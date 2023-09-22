import type {Theme} from 'types/state'

export function changeTheme(theme: Theme) {
  switch (theme) {
    case 'dark':
      document.documentElement.classList.add('night')
      break
    case 'light':
      document.documentElement.classList.remove('night')
      break
  }
}
