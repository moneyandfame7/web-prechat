import { FC, TargetedEvent, useCallback } from 'preact/compat'

import { getActions } from 'state/global/action'
import { getGlobalState } from 'state/global/signal'
import type { Theme } from 'state/global/types'

const ThemeSwitch: FC = () => {
  const { changeTheme } = getActions()
  const $theme = getGlobalState((state) => state.$theme)
  // const { signUp } = getActions()
  const handleChangeTheme = useCallback(
    (e: TargetedEvent<HTMLSelectElement, Event>) => {
      const { value } = e.currentTarget
      changeTheme(value as Theme)
    },
    []
  )
  return (
    <select onChange={handleChangeTheme} value={$theme}>
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  )
}

export { ThemeSwitch }
