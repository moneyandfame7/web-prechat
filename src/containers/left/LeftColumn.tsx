import {type FC, memo, useEffect, useState} from 'preact/compat'

import {connect} from 'state/connect'
import {getGlobalState} from 'state/signal'

import {APP_TRANSITION_NAME} from 'common/config'
import {addEscapeListener} from 'utilities/keyboardListener'

import {SettingsScreens} from 'types/screens'
import {LeftColumnGroup, LeftColumnScreen} from 'types/ui'

import {Transition} from 'components/transitions'

import Contacts from './contacts/Contacts.async'
import {LeftColumnProvider} from './context'
import CreateChat from './create/CreateChat.async'
import LeftMain from './main/LeftMain'
import Settings from './settings/Settings.async'

import './LeftColumn.scss'

// const classNames: Record<LeftColumnGroup, string> = {
//   [LeftColumnGroup.Main]: 'LeftColumn-Main',
//   [LeftColumnGroup.Contacts]: 'LeftColumn-Contacts',
//   [LeftColumnGroup.Settings]: 'LeftColumn-Settings',
//   [LeftColumnGroup.NewChannel]: 'LeftColumn-NewChannel',
//   [LeftColumnGroup.NewGroup]: 'LeftColumn-NewGroup',
// }
type StateProps = {
  isChatOpen: boolean
}
const LeftColumn: FC<StateProps> = (/* {isChatOpen} */) => {
  const {globalSettingsScreen} = getGlobalState()

  const [activeScreen, setActiveScreen] = useState(LeftColumnScreen.Chats)
  const [settingsScreen, setSettingsScreen] = useState(SettingsScreens.Main)
  let activeGroup: LeftColumnGroup = LeftColumnGroup.Main

  switch (activeScreen) {
    case LeftColumnScreen.Contacts:
      activeGroup = LeftColumnGroup.Contacts
      break

    case LeftColumnScreen.Chats:
    case LeftColumnScreen.Search:
      activeGroup = LeftColumnGroup.Main
      break

    case LeftColumnScreen.NewChannelStep1:
    case LeftColumnScreen.NewChannelStep2:
      activeGroup = LeftColumnGroup.NewChannel
      break

    case LeftColumnScreen.NewGroupStep1:
    case LeftColumnScreen.NewGroupStep2:
      activeGroup = LeftColumnGroup.NewGroup
      break

    case LeftColumnScreen.Settings:
      activeGroup = LeftColumnGroup.Settings
      break
  }
  const handleReset = (force?: boolean) => {
    if (force || activeScreen === LeftColumnScreen.Search) {
      setActiveScreen(LeftColumnScreen.Chats)
      return
    }

    if (activeScreen === LeftColumnScreen.Chats) {
      setActiveScreen(LeftColumnScreen.Search)
      return
    }

    if (activeScreen === LeftColumnScreen.NewChannelStep2) {
      setActiveScreen(LeftColumnScreen.NewChannelStep1)
      return
    }
    if (activeScreen === LeftColumnScreen.NewGroupStep2) {
      setActiveScreen(LeftColumnScreen.NewGroupStep1)
      return
    }

    if (activeScreen === LeftColumnScreen.Settings) {
      // eslint-disable-next-line no-console
      console.error(SettingsScreens[settingsScreen], 'NEED TO HANDLE SETTINGS')
    }

    setActiveScreen(LeftColumnScreen.Chats)
  }

  useEffect(() => {
    return addEscapeListener(() => {
      handleReset(false)
    })
  }, [activeScreen])
  useEffect(() => {
    /* використовую глобальну змінну для того, щоб відкривати налаштування з інших екранів  */
    if (globalSettingsScreen !== undefined) {
      setActiveScreen(LeftColumnScreen.Settings)
      setSettingsScreen(globalSettingsScreen)
    }
  }, [globalSettingsScreen])

  const renderScreen = () => {
    switch (activeGroup) {
      case LeftColumnGroup.Contacts:
        return <Contacts />
      case LeftColumnGroup.Main:
        return <LeftMain />
      case LeftColumnGroup.NewChannel:
        return <CreateChat isGroup={false} />
      case LeftColumnGroup.NewGroup:
        return <CreateChat isGroup />
      case LeftColumnGroup.Settings:
        return <Settings currentScreen={settingsScreen} />
    }
  }

  return (
    <LeftColumnProvider
      store={{
        resetScreen: handleReset,
        setScreen: setActiveScreen,
        activeScreen,
      }}
    >
      <div class="LeftColumn">
        {/* <SingleTransition
          unmount={false}
          in={isChatOpen}
          shouldSkip={isMobile}
          name="slideDark"
          direction={isChatOpen ? -1 : 1}
        > */}
        <Transition
          cleanupException={LeftColumnGroup.Main}
          activeKey={activeGroup}
          name={APP_TRANSITION_NAME}
        >
          {renderScreen()}
        </Transition>
        {/* </SingleTransition> */}
      </div>
    </LeftColumnProvider>
  )
}

export default memo(
  connect(({currentChat}): StateProps => {
    return {
      isChatOpen: Boolean(currentChat.chatId),
    }
  })(LeftColumn)
)
