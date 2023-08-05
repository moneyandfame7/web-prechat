import {type FC, memo, useState, useEffect} from 'preact/compat'

import {LeftColumnGroup, LeftColumnScreen} from 'types/ui'

import SwitchTransition from 'components/transitions/SwitchTransition'
import type {TransitionCases} from 'components/transitions/types'
import {
  ZOOM_SLIDE_IN,
  ZOOM_SLIDE_OUT
  // ZOOM_SLIDE_IN,
  // ZOOM_SLIDE_OUT
} from 'components/transitions/helpers'

import LeftMain from './main/LeftMain'
import CreateChat from './create/CreateChat.async'
import Settings from './settings/Settings.async'
import Contacts from './contacts/Contacts.async'

import {LeftColumnProvider} from './context'

import './LeftColumn.scss'
import {SettingsScreens} from 'types/screens'
import {getGlobalState} from 'state/signal'

const classNames: Record<LeftColumnGroup, string> = {
  [LeftColumnGroup.Main]: 'LeftColumn-Main',
  [LeftColumnGroup.Contacts]: 'LeftColumn-Contacts',
  [LeftColumnGroup.Settings]: 'LeftColumn-Settings',
  [LeftColumnGroup.NewChannel]: 'LeftColumn-NewChannel',
  [LeftColumnGroup.NewGroup]: 'LeftColumn-NewGroup'
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
const getTransitionByCase = (
  _: LeftColumnGroup,
  previousScreen?: LeftColumnGroup
): TransitionCases => {
  if (previousScreen === LeftColumnGroup.Main) {
    return ZOOM_SLIDE_IN
  }

  return ZOOM_SLIDE_OUT
}
const LeftColumn: FC = () => {
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
    if (force) {
      setActiveScreen(LeftColumnScreen.Chats)
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
    if (activeScreen === LeftColumnScreen.Search) {
      setActiveScreen(LeftColumnScreen.Chats)

      return
    }

    setActiveScreen(LeftColumnScreen.Chats)
  }
  const {globalSettingsScreen} = getGlobalState()

  useEffect(() => {
    /* використовую глобальну змінну для того, щоб відкривати налаштування з інших екранів  */
    if (globalSettingsScreen !== undefined) {
      setActiveScreen(LeftColumnScreen.Settings)
      setSettingsScreen(globalSettingsScreen)
    }
  }, [globalSettingsScreen])

  const renderScreen = (activeKey: LeftColumnGroup) => {
    switch (activeKey) {
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
        activeScreen
      }}
    >
      <div class="LeftColumn">
        <SwitchTransition
          activeKey={activeGroup}
          classNames={classNames}
          cleanupException={[LeftColumnGroup.Main]}
          name="fade"
          permanentClassname="Screen-container"
          getTransitionByCase={getTransitionByCase}
        >
          {renderScreen(activeGroup)}
        </SwitchTransition>
      </div>
    </LeftColumnProvider>
  )
}

export default memo(LeftColumn)
