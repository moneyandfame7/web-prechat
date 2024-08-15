import {type FC, memo, useEffect, useState} from 'preact/compat'

import {connect} from 'state/connect'
import {getPreferredAnimations} from 'state/helpers/settings'
import {selectGeneralSettings} from 'state/selectors/settings'
import {getGlobalState} from 'state/signal'

import {addEscapeListener} from 'utilities/keyboardListener'

import {LeftColumnGroup, LeftColumnScreen, SettingsScreens} from 'types/screens'
import type {PageAnimations} from 'types/state'

import {MyStories} from 'components/stories'
import {Transition} from 'components/transitions'

import {Archived} from './archived'
import Contacts from './contacts/Contacts.async'
import {LeftColumnProvider} from './context'
import CreateChat from './create/CreateChat.async'
import LeftMain from './main/LeftMain'
import Settings from './settings/Settings.async'

import './LeftColumn.scss'

type StateProps = {
  isChatOpen: boolean
  globalSettingsScreen: SettingsScreens | undefined
  isStoriesViewerOpen: boolean
  preferredAnimations: PageAnimations
}
const LeftColumn: FC<StateProps> = ({
  globalSettingsScreen,
  isStoriesViewerOpen,
  preferredAnimations,
}) => {
  const [activeScreen, setActiveScreen] = useState(LeftColumnScreen.Chats)
  const [settingsScreen, setSettingsScreen] = useState(SettingsScreens.Main)
  let activeGroup: LeftColumnGroup = LeftColumnGroup.Main

  switch (activeScreen) {
    case LeftColumnScreen.Contacts:
      activeGroup = LeftColumnGroup.Contacts
      break
    case LeftColumnScreen.Archived:
      activeGroup = LeftColumnGroup.Archived
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
    case LeftColumnScreen.MyStories:
      activeGroup = LeftColumnGroup.MyStories
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

  useEffect(
    () =>
      !isStoriesViewerOpen
        ? addEscapeListener(() => {
            handleReset(false)
          })
        : undefined,
    [activeScreen]
  )
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
      case LeftColumnGroup.Archived:
        return <Archived />
      case LeftColumnGroup.MyStories:
        return <MyStories />
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
      <div class="LeftColumn" id="left-column">
        <Transition
          innerAttributes={{
            [LeftColumnGroup.Contacts]: {id: 'contacts-container'},
          }}
          cleanupException={LeftColumnGroup.Main}
          activeKey={activeGroup}
          name={preferredAnimations}
        >
          {renderScreen()}
        </Transition>
      </div>
    </LeftColumnProvider>
  )
}

export default memo(
  connect(
    (state): StateProps => ({
      isChatOpen: Boolean(state.currentChat.chatId),
      globalSettingsScreen: state.globalSettingsScreen,
      isStoriesViewerOpen: state.stories.isOpen,
      preferredAnimations: selectGeneralSettings(state, 'animations').page,
      // pageAnimations: settings.general.pageAnimations,
    })
  )(LeftColumn)
)
