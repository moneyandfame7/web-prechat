import {type FC, memo, useEffect, useState} from 'preact/compat'

import {getGlobalState} from 'state/signal'

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

const classNames: Record<LeftColumnGroup, string> = {
  [LeftColumnGroup.Main]: 'LeftColumn-Main',
  [LeftColumnGroup.Contacts]: 'LeftColumn-Contacts',
  [LeftColumnGroup.Settings]: 'LeftColumn-Settings',
  [LeftColumnGroup.NewChannel]: 'LeftColumn-NewChannel',
  [LeftColumnGroup.NewGroup]: 'LeftColumn-NewGroup',
}

// const TRANSITION_CASES: TransitionScreenConfig<LeftColumnGroup> = {
//   [LeftColumnGroup.Main]: {
//     [LeftColumnGroup.Contacts]: SLIDE_IN,
//     [LeftColumnGroup.NewChannel]: SLIDE_IN,
//     [LeftColumnGroup.NewGroup]: SLIDE_IN,
//     [LeftColumnGroup.Settings]: SLIDE_IN
//   },
//   [LeftColumnGroup.Contacts]: {
//     [LeftColumnGroup.Main]: SLIDE_OUT
//   },
//   [LeftColumnGroup.NewChannel]: {
//     [LeftColumnGroup.Main]: SLIDE_OUT
//   },
//   [LeftColumnGroup.NewGroup]: {
//     [LeftColumnGroup.Main]: SLIDE_OUT
//   },
//   [LeftColumnGroup.Settings]: {
//     [LeftColumnGroup.Main]: SLIDE_OUT
//   }
// }

const LeftColumn: FC = () => {
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
    console.log(LeftColumnScreen[activeScreen])

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

    setActiveScreen(LeftColumnScreen.Chats)
  }

  useEffect(() => {
    return addEscapeListener(() => {
      handleReset()
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
        <Transition
          cleanupException={LeftColumnGroup.Main}
          activeKey={activeGroup}
          name="zoomSlide"
          // containerClassname="Screen-container"
        >
          {renderScreen()}
        </Transition>
        {/* <SwitchTransition
          activeKey={activeGroup}
          // classNames={classNames}
          cleanupException={[LeftColumnGroup.Main]}
          name="fade"
          permanentClassname="Screen-container"
          getTransitionByCase={getTransitionByCase}
        >
          {renderScreen(activeGroup)}
        </SwitchTransition> */}
      </div>
    </LeftColumnProvider>
  )
}

export default memo(LeftColumn)
