import {type FC, memo, useState} from 'preact/compat'

import MountTransition from 'components/MountTransition'
import type {TransitionType} from 'components/Transition'

import {LeftColumnGroup, LeftColumnScreen, type VNodeWithKey} from 'types/ui'

import LeftMain from './main/LeftMain'
import CreateChat from './create/CreateChat.async'
import Settings from './settings/Settings.async'
import Contacts from './contacts/Contacts.async'

import {LeftColumnProvider} from './context'

import './LeftColumn.scss'

const classNames: Record<LeftColumnGroup, string> = {
  [LeftColumnGroup.Main]: 'LeftColumn-Main',
  [LeftColumnGroup.Contacts]: 'LeftColumn-Contacts',
  [LeftColumnGroup.Settings]: 'LeftColumn-Settings',
  [LeftColumnGroup.NewChannel]: 'LeftColumn-NewChannel',
  [LeftColumnGroup.NewGroup]: 'LeftColumn-NewGroup'
}

function getScreenTransition(
  newEl: VNodeWithKey<LeftColumnGroup>,
  current: VNodeWithKey<string>
): TransitionType {
  if (current.key === LeftColumnGroup.Main) {
    return 'zoomSlideReverse'
  }

  return 'zoomSlide'
}

const LeftColumn: FC = () => {
  // const leftColumnWidth = getGlobalState((state) => state.settings.leftColumnWidth)
  // const {ref, resize, width} = useResize<HTMLDivElement>({
  //   initialWidth: leftColumnWidth,
  //   minWidth: 250,
  //   maxWidth: 430,
  //   debounceCb: (width) => {
  //     updateGlobalState({
  //       settings: {
  //         leftColumnWidth: width
  //       }
  //     })
  //   }
  // })

  // const {setScreen, renderScreen, resetScreen, activeScreen} =
  //   useScreenManager<LeftColumnScreen>({
  //     initial: LeftColumnScreen.Main,
  //     cases: screenCases,
  //     resetCb: (currentScreen, force) => {
  //       if (force) {
  //         setScreen(LeftColumnScreen.Main)
  //         return
  //       }

  //       if (currentScreen === LeftColumnScreen.NewChannelStep2) {
  //         setScreen(LeftColumnScreen.NewChannelStep1)
  //         return
  //       }
  //       if (currentScreen === LeftColumnScreen.NewGroupStep2) {
  //         setScreen(LeftColumnScreen.NewGroupStep1)
  //         return
  //       }

  //       setScreen(LeftColumnScreen.Main)
  //     }
  //   })
  const [activeScreen, setActiveScreen] = useState(LeftColumnScreen.Chats)
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

  const renderScreen = () => {
    switch (activeGroup) {
      case LeftColumnGroup.Contacts:
        return <Contacts key={LeftColumnGroup.Contacts} />
      case LeftColumnGroup.Main:
        return <LeftMain key={LeftColumnGroup.Main} />
      case LeftColumnGroup.NewChannel:
        return <CreateChat isGroup={false} key={LeftColumnGroup.NewChannel} />
      case LeftColumnGroup.NewGroup:
        return <CreateChat isGroup key={LeftColumnGroup.NewGroup} />
      case LeftColumnGroup.Settings:
        return <Settings key={LeftColumnGroup.Settings} />
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
      <div
        class="LeftColumn"
        // ref={ref}
        // style={{width, '--left-column-width': width + 'px'}}
      >
        <MountTransition
          classNames={classNames}
          shouldCleanup={[
            LeftColumnGroup.Settings,
            LeftColumnGroup.Contacts,
            LeftColumnGroup.NewChannel,
            LeftColumnGroup.NewGroup
          ]}
          activeKey={activeGroup}
          initial={false}
          // name="zoomSlide"
          getTransitionForNew={getScreenTransition}
        >
          {renderScreen()}
        </MountTransition>
        {/* <div class="LeftColumn-resizer" onMouseDown={resize} /> */}
      </div>
    </LeftColumnProvider>
  )
}

export default memo(LeftColumn)
