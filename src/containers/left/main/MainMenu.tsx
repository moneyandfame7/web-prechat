import { FC, memo, useMemo } from 'preact/compat'

import { LeftColumnScreen } from 'types/ui'
import { useBoolean } from 'hooks/useFlag'

import { ReactComponent as SavedMessagesIcon } from 'assets/icons/saved-messages.svg'
import { ReactComponent as SettingsIcon } from 'assets/icons/settings.svg'
import { ReactComponent as UserIcon } from 'assets/icons/user.svg'
import { ReactComponent as AnimationsIcon } from 'assets/icons/figma.svg'
import { ReactComponent as MoonIcon } from 'assets/icons/moon.svg'
import { ReactComponent as GitIcon } from 'assets/icons/github.svg'
// import { ReactComponent as MenuIcon } from 'assets/icons/menu.svg'
// import { ReactComponent as SunIcon } from 'assets/icons/sun.svg'

import { Menu, MenuItem } from 'components/popups/menu'
import { IconButton } from 'components/ui'

import { useLeftColumn } from '../context'

import './MainMenu.scss'
export const LeftMainMenu: FC = memo(() => {
  const { setTrue, value, setFalse } = useBoolean(false)
  const { setScreen } = useLeftColumn()

  const items = useMemo(
    () => (
      <>
        <MenuItem>
          <SavedMessagesIcon />
          Saved messages
        </MenuItem>
        <MenuItem
          onClick={() => {
            setScreen(LeftColumnScreen.Contacts)
          }}
        >
          <UserIcon />
          Contacts
        </MenuItem>
        <MenuItem
          onClick={() => {
            setScreen(LeftColumnScreen.Settings)
          }}
        >
          <SettingsIcon />
          Settings
        </MenuItem>

        <MenuItem>
          <AnimationsIcon />
          Animations
        </MenuItem>
        <MenuItem>
          <MoonIcon />
          Night Mode
        </MenuItem>
        <MenuItem>
          <GitIcon />
          Source Code
        </MenuItem>
      </>
    ),
    []
  )
  return (
    <div class="LeftColumn-Main_Menu">
      <IconButton onClick={setTrue} icon="menu" />

      <Menu placement="top-left" isOpen={value} withMount={false} onClose={setFalse}>
        {items}
      </Menu>
    </div>
  )
})
