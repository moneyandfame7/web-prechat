import {useRef, type FC} from 'preact/compat'

import {Button} from 'components/ui'

import {getGlobalState} from 'state/signal'

import {getActions} from 'state/action'

import {deepSignal} from 'deepsignal'

import {SwitchLanguageTest} from 'components/test'
import {t} from 'lib/i18n'
import './MiddleColumn.scss'
import {SettingsScreens} from 'types/screens'
import {ImageUpload} from 'components/UploadPhoto'

export const skeleton = deepSignal({
  isLoading: true
})
export const MiddleColumn: FC = () => {
  const render = useRef(0)
  const global = getGlobalState()
  const actions = getActions()
  render.current += 1

  const signOut = () => {
    actions.signOut()
  }

  const toggleLoading = () => {
    skeleton.isLoading = !skeleton.isLoading
  }

  const openModal = () => {
    actions.openAddContactModal({userId: '18234812834'})
  }

  const toggleTheme = () => {
    global.settings.theme = global.settings.theme === 'dark' ? 'light' : 'dark'
    switch (global.settings.theme) {
      case 'dark':
        document.documentElement.classList.add('night')
        break
      case 'light':
        document.documentElement.classList.remove('night')
    }
  }

  return (
    <div class="MiddleColumn">
      <div class="MiddleColumn-inner">
        <h1>{render.current}</h1>
        {/* {global.auth.$phoneNumber} */}
        {/* {json} */}
        <SwitchLanguageTest />
        <Button
          onClick={() => {
            actions.changeSettingsScreen(SettingsScreens.ChatFolders)
          }}
        >
          SETTING SCREEN
        </Button>
        <p contentEditable>Lorem ipsum dorem ahaha</p>
        <Button onClick={toggleTheme}>Toggle theme</Button>
        <ImageUpload />
        <h1>{global.auth.$phoneNumber}</h1>
        <p>{t('Auth.CodeSendOnPhone')}</p>
        <p>{t('RememberMe')}</p>
        <Button onClick={toggleLoading}>TOGGLE_SKELETON</Button>
        <Button onClick={signOut}>Sign Out</Button>
        <Button onClick={openModal}>Open modal</Button>
        <Button onClick={toggleTheme}>
          Toggle theme, current - {global.settings.$theme}
        </Button>
      </div>
    </div>
  )
}
