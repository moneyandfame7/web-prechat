import {type FC, memo, useMemo} from 'preact/compat'

import {getGlobalState} from 'state/signal'

import {t} from 'lib/i18n'

import {GITHUB_SOURCE} from 'common/environment'

import {LeftColumnScreen} from 'types/ui'

import {MenuItem} from 'components/popups/menu'
import {Icon, IconButton} from 'components/ui'
import {DropdownMenu} from 'components/ui/DropdownMenu'

import {useLeftColumn} from '../context'

import './MainMenu.scss'

export const LeftMainMenu: FC = memo(() => {
  const {setScreen} = useLeftColumn()
  const lang = getGlobalState((state) => state.settings.i18n.lang_code)

  const items = useMemo(
    () => (
      <>
        <MenuItem>
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

        <MenuItem>
          <Icon name="animations" />
          {t('Animations')}
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
    ),
    [lang]
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
        {items}
      </DropdownMenu>
      {/* <Menu placement="top left" isOpen={value} withMount={false} onClose={setFalse}>
        {items}
      </Menu> */}
    </div>
  )
})
