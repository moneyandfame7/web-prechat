import {type FC, memo, useState} from 'preact/compat'

import {LeftColumnGroup, LeftColumnScreen} from 'types/ui'

import SwitchTransition from 'components/transitions/SwitchTransition'
import type {TransitionCases} from 'components/transitions/types'
import {
  SLIDE_FADE_OUT,
  SLIDE_FADE_IN,
  ZOOM_SLIDE_IN,
  ZOOM_SLIDE_OUT
} from 'components/transitions/helpers'

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
        return <Settings />
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
        <SwitchTransition
          activeKey={activeGroup}
          classNames={classNames}
          cleanupException={[LeftColumnGroup.Main]}
          name="fade"
          getTransitionByCase={getTransitionByCase}
        >
          {renderScreen(activeGroup)}
        </SwitchTransition>
        {/* <MountTransition
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
        </MountTransition> */}
        {/* <div class="LeftColumn-resizer" onMouseDown={resize} /> */}
      </div>
    </LeftColumnProvider>
  )
}

export default memo(LeftColumn)
