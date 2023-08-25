import {type FC, memo, useCallback, useEffect, useState} from 'preact/compat'

import CreateChatStep1 from './CreateChatStep1'
import CreateChatStep2 from './CreateChatStep2'

import {useLeftColumn} from '../context'
import {LeftColumnScreen} from 'types/ui'
import {
  type TransitionCases,
  SwitchTransition,
  SLIDE_FADE_OUT,
  SLIDE_FADE_IN,
} from 'components/transitions'

export interface CreateChatProps {
  isGroup: boolean
}

enum CreateChatGroup {
  Step1 = 'Step1',
  Step2 = 'Step2',
}
const screenClassnames = {
  [CreateChatGroup.Step1]: 'LeftColumn-CreateChatStep1',
  [CreateChatGroup.Step2]: 'LeftColumn-CreateChatStep2',
}
function getTransitionByCase(
  activeScreen: CreateChatGroup
  // previousScreen?: CreateChatGroup
): TransitionCases {
  switch (activeScreen) {
    case CreateChatGroup.Step2:
      return SLIDE_FADE_IN

    default:
      return SLIDE_FADE_OUT
  }
}

const CreateChat: FC<CreateChatProps> = ({isGroup}) => {
  const {activeScreen} = useLeftColumn()

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const onSelectMember = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(existingId => existingId !== id)
      }
      return [...prev, id]
    })
  }

  const [activeGroup, setActiveGroup] = useState(CreateChatGroup.Step1)
  useEffect(() => {
    switch (activeScreen) {
      case LeftColumnScreen.NewChannelStep1:
      case LeftColumnScreen.NewGroupStep1:
        setActiveGroup(CreateChatGroup.Step1)
        break
      case LeftColumnScreen.NewChannelStep2:
      case LeftColumnScreen.NewGroupStep2:
        setActiveGroup(CreateChatGroup.Step2)
    }
  }, [activeScreen])

  const renderScreen = useCallback(
    (activeGroup: CreateChatGroup) => {
      switch (activeGroup) {
        case CreateChatGroup.Step1:
          return (
            <CreateChatStep1
              selectedIds={selectedIds}
              handleSelect={onSelectMember}
              isGroup={isGroup}
              key={CreateChatGroup.Step1}
            />
          )
        case CreateChatGroup.Step2:
          return (
            <CreateChatStep2
              selectedIds={selectedIds}
              isGroup={isGroup}
              key={CreateChatGroup.Step2}
            />
          )
      }
    },
    [selectedIds]
  )

  return (
    <SwitchTransition
      classNames={screenClassnames}
      activeKey={activeGroup}
      name="fade"
      permanentClassname="Screen-container"
      getTransitionByCase={getTransitionByCase}
    >
      {renderScreen(activeGroup)}
    </SwitchTransition>
  )
}
export default memo(CreateChat)
