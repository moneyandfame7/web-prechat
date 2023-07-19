import type {FC} from 'preact/compat'
import {memo, useCallback} from 'preact/compat'

import CreateChatStep1 from './CreateChatStep1.async'
import CreateChatStep2 from './CreateChatStep2.async'
import MountTransition from 'components/MountTransition'
import type {TransitionType} from 'components/Transition'

import {useLeftColumn} from '../context'
import {LeftColumnScreen, type VNodeWithKey} from 'types/ui'

export interface CreateChatProps {
  isGroup: boolean
}

function getScreenTransition(
  newEl: VNodeWithKey<LeftColumnScreen>,
  current: VNodeWithKey<LeftColumnScreen>
): TransitionType {
  if (newEl.key === LeftColumnScreen.Chats) {
    return 'fade'
  }
  // console.log(newEl.key, current.key)
  switch (current.key) {
    case LeftColumnScreen.NewChannelStep1:
    case LeftColumnScreen.NewGroupStep1:
      return 'zoomSlide'

    default:
      return 'zoomSlideReverse'
  }
}
const CreateChat: FC<CreateChatProps> = ({isGroup}) => {
  const {activeScreen} = useLeftColumn()
  const renderScreen = useCallback(() => {
    switch (activeScreen) {
      case LeftColumnScreen.NewChannelStep1:
      case LeftColumnScreen.NewGroupStep1:
      default:
        return <CreateChatStep1 isGroup={isGroup} key={LeftColumnScreen[activeScreen]} />
      case LeftColumnScreen.NewChannelStep2:
      case LeftColumnScreen.NewGroupStep2:
        return <CreateChatStep2 isGroup={isGroup} key={LeftColumnScreen[activeScreen]} />
    }
  }, [activeScreen])

  return (
    <MountTransition
      shouldCleanup={false}
      // name="fade"
      // duration={5000}
      activeKey={activeScreen}
      getTransitionForNew={getScreenTransition}
    >
      {renderScreen()}
    </MountTransition>
  )
}
export default memo(CreateChat)
