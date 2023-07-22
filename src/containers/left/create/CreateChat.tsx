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

enum CreateChatGroup {
  Step1 = 'Step1',
  Step2 = 'Step2'
}
const screenClassnames = {
  [CreateChatGroup.Step1]: 'LeftColumn-CreateChatStep1',
  [CreateChatGroup.Step2]: 'LeftColumn-CreateChatStep2'
}
function getScreenTransition(
  newEl: VNodeWithKey<CreateChatGroup>,
  current: VNodeWithKey<CreateChatGroup>
): TransitionType {
  switch (current.key) {
    case CreateChatGroup.Step1:
      return 'zoomSlideReverse'

    default:
      return 'zoomSlide'
  }
}

const CreateChat: FC<CreateChatProps> = ({isGroup}) => {
  const {activeScreen} = useLeftColumn()

  let activeGroup: CreateChatGroup = CreateChatGroup.Step1
  switch (activeScreen) {
    case LeftColumnScreen.NewChannelStep1:
    case LeftColumnScreen.NewGroupStep1:
      activeGroup = CreateChatGroup.Step1
      break
    case LeftColumnScreen.NewChannelStep2:
    case LeftColumnScreen.NewGroupStep2:
      activeGroup = CreateChatGroup.Step2
  }
  const renderScreen = useCallback(() => {
    switch (activeGroup) {
      case CreateChatGroup.Step1:
        return <CreateChatStep1 isGroup={isGroup} key={CreateChatGroup.Step1} />
      case CreateChatGroup.Step2:
        return <CreateChatStep2 isGroup={isGroup} key={CreateChatGroup.Step2} />
    }
  }, [activeGroup, isGroup])

  return (
    <MountTransition
      shouldCleanup={true}
      // name="fade"
      classNames={screenClassnames}
      activeKey={activeGroup}
      getTransitionForNew={getScreenTransition}
    >
      {renderScreen()}
    </MountTransition>
  )
}
export default memo(CreateChat)
