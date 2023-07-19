import type {FC} from 'preact/compat'
import {memo, useMemo} from 'preact/compat'

import {LeftColumnScreen} from 'types/ui'
import {useBoolean} from 'hooks/useFlag'

import {Menu, MenuItem} from 'components/popups/menu'
import {Icon, IconButton} from 'components/ui'

import {useLeftColumn} from '../context'

import './MainMenu.scss'
import {GITHUB_SOURCE} from 'common/config'
import {t} from 'lib/i18n'
import {getGlobalState} from 'state/signal'
export const LeftMainMenu: FC = memo(() => {
  const {setTrue, value, setFalse} = useBoolean(false)
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
      <IconButton onClick={setTrue} icon="menu" />

      <Menu placement="top-left" isOpen={value} withMount={false} onClose={setFalse}>
        {items}
      </Menu>
    </div>
  )
})
