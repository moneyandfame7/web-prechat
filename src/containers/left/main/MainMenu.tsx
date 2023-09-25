import {type FC, memo} from 'preact/compat'

import {getActions} from 'state/action'
import {getGlobalState} from 'state/signal'

import {t} from 'lib/i18n'

import {GITHUB_SOURCE} from 'common/environment'

import {LeftColumnScreen} from 'types/ui'

import {MenuItem} from 'components/popups/menu'
import {Icon, IconButton} from 'components/ui'
import {DropdownMenu} from 'components/ui/DropdownMenu'
import {SwitchInput} from 'components/ui/SwitchInput'

import {useLeftColumn} from '../context'

import './MainMenu.scss'

export const LeftMainMenu: FC = memo(() => {
  const {setScreen} = useLeftColumn()
  const global = getGlobalState()
  const {changeSettings} = getActions()
  const handleSwitchAnimations = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (
      target.classList.contains('switch-input-wrapper') ||
      target.classList.contains('switch-input-label')
    ) {
      return // don't handle switch input
    }

    changeSettings({
      general: {
        animationsEnabled: !global.settings.general.animationsEnabled,
      },
    })
  }

  const items = () => (
    <>
      <MenuItem autoClose={false}>
        <Icon name="savedMessages" />
        {t('SavedMessages')}
      </MenuItem>
      <MenuItem
        onClick={() => {
          setScreen(LeftColumnScreen.Contacts)
        }}
      >
        <Icon name="user" />
        {t('Contacts')}
      </MenuItem>
      <MenuItem
        onClick={() => {
          setScreen(LeftColumnScreen.Settings)
        }}
      >
        <Icon name="settings" />
        {t('Settings')}
      </MenuItem>

      <MenuItem autoClose={false} onClick={handleSwitchAnimations}>
        <Icon name="animations" />
        {t('Animations')}
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
      <MenuItem>
        <Icon name="darkMode" />
        {t('DarkMode')}
      </MenuItem>
      <MenuItem>
        <Icon name="download" />
        {t('InstallApp')}
      </MenuItem>
      <MenuItem to={GITHUB_SOURCE}>
        <Icon name="bug" />
        {t('SourceCode')}
      </MenuItem>
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
