import {type FC, memo} from 'preact/compat'

import {getActions} from 'state/action'
import {getGlobalState} from 'state/signal'

import {TEST_translate, t} from 'lib/i18n'

import {GITHUB_SOURCE} from 'common/environment'

import {LeftColumnScreen} from 'types/screens'

import {MenuItem} from 'components/popups/menu'
import {Icon, IconButton} from 'components/ui'
import {DropdownMenu} from 'components/ui/DropdownMenu'
import {SwitchInput} from 'components/ui/SwitchInput'

import {useLeftColumn} from '../context'

import './MainMenu.scss'

function isSwitchEl(e: MouseEvent) {
  const target = e.target as HTMLElement
  return (
    target.classList.contains('switch-input-wrapper') ||
    target.classList.contains('switch-input-label')
  )
}
export const LeftMainMenu: FC = memo(() => {
  const {setScreen} = useLeftColumn()
  const global = getGlobalState()
  const {changeSettings, openChat} = getActions()
  const handleSwitchAnimations = (e: MouseEvent) => {
    if (isSwitchEl(e)) {
      return
    }

    changeSettings({
      general: {
        animationsEnabled: !global.settings.general.animationsEnabled,
      },
    })
  }

  const handleSwitchDarkMode = (e: MouseEvent) => {
    if (isSwitchEl(e)) {
      return
    }
    changeSettings({
      general: {
        theme: global.settings.general.theme === 'light' ? 'dark' : 'light',
      },
    })
  }

  const handleSavedMessages = () => {
    openChat({type: 'self', shouldChangeHash: true})
  }

  const handleArchivedChats = () => {
    setScreen(LeftColumnScreen.Archived)
  }
  const handleMyStories = () => {
    setScreen(LeftColumnScreen.MyStories)
  }

  const items = () => (
    <>
      <MenuItem
        title={TEST_translate('SavedMessages')}
        icon="savedMessages"
        onClick={handleSavedMessages}
      />
      <MenuItem
        title={TEST_translate('ArchivedChats')}
        icon="archived"
        onClick={handleArchivedChats}
        badge="3"
      />
      <MenuItem
        title={TEST_translate('MyStories')}
        icon="story"
        onClick={handleMyStories}
        badge="13"
      />
      <MenuItem
        onClick={() => {
          setScreen(LeftColumnScreen.Contacts)
        }}
        icon="user"
        title={TEST_translate('Contacts')}
      />
      <MenuItem
        onClick={() => {
          setScreen(LeftColumnScreen.Settings)
        }}
        icon="settings"
        title={TEST_translate('Settings')}
      />

      <MenuItem
        title={TEST_translate('Animations')}
        icon="animations"
        autoClose={false}
        onClick={handleSwitchAnimations}
      >
        <SwitchInput
          onChange={() => {
            changeSettings({
              general: {
                animationsEnabled: !global.settings.general.animationsEnabled,
              },
            })
          }}
          size="medium"
          checked={global.settings.general.animationsEnabled}
        />
      </MenuItem>
      <MenuItem
        title={TEST_translate('DarkMode')}
        icon="darkMode"
        autoClose={false}
        onClick={handleSwitchDarkMode}
      >
        <SwitchInput
          onChange={() => {
            changeSettings({
              general: {
                theme: global.settings.general.theme === 'light' ? 'dark' : 'light',
              },
            })
          }}
          size="medium"
          checked={global.settings.general.theme === 'dark'}
        />
      </MenuItem>
      <MenuItem title={TEST_translate('InstallApp')} icon="download" />
      <MenuItem title={TEST_translate('SourceCode')} icon="bug" to={GITHUB_SOURCE} />
    </>
  )
  return (
    <div class="LeftColumn-Main_Menu">
      <DropdownMenu
        placement={{
          top: true,
          left: true,
        }}
        transform="top left"
        button={<IconButton ripple={false} icon="menu" />}
      >
        {items()}
      </DropdownMenu>
      {/* <Menu placement="top left" isOpen={value} withMount={false} onClose={setFalse}>
        {items}
      </Menu> */}
    </div>
  )
})
