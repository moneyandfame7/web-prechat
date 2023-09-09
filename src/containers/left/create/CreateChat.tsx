import {type FC, memo, useCallback, useEffect, useState} from 'preact/compat'

import {LeftColumnScreen} from 'types/ui'

import {Transition} from 'components/transitions'

import {useLeftColumn} from '../context'
import CreateChatStep1 from './CreateChatStep1'
import CreateChatStep2 from './CreateChatStep2'

export interface CreateChatProps {
  isGroup: boolean
}

enum CreateChatGroup {
  Step1,
  Step2,
}

const CreateChat: FC<CreateChatProps> = ({isGroup}) => {
  const {activeScreen} = useLeftColumn()

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const onSelectMember = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((existingId) => existingId !== id)
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

  const renderScreen = useCallback(() => {
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
  }, [selectedIds, activeGroup, isGroup])

  return (
    <Transition
      name="zoomSlide"
      activeKey={activeGroup}
      shouldCleanup={false}
      // cleanupException={CreateChatGroup.Step1}
    >
      {renderScreen()}
    </Transition>
  )
}
export default memo(CreateChat)
