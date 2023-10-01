import {type FC, memo, useCallback, useEffect, useState} from 'preact/compat'

import {APP_TRANSITION_NAME} from 'common/environment'

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

/* @todo доробити, бо коли вибираю юзерів цей контейнер ререндериться.... */
const CreateChat: FC<CreateChatProps> = ({isGroup}) => {
  const {activeScreen} = useLeftColumn()

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const onSelectMember = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((existingId) => existingId !== id)
      }
      return [...prev, id]
    })
  }, [])

  const [activeGroup, setActiveGroup] = useState(CreateChatGroup.Step1)
  useEffect(() => {
    switch (activeScreen) {
      case LeftColumnScreen.NewChannelStep1:
      case LeftColumnScreen.NewGroupStep1:
        // default:
        setActiveGroup(CreateChatGroup.Step1)
        break
      case LeftColumnScreen.NewChannelStep2:
      case LeftColumnScreen.NewGroupStep2:
        setActiveGroup(CreateChatGroup.Step2)
    }
  }, [activeScreen])

  // console.log('CREATE_CHAT', LeftColumnScreen[activeScreen])
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
      name={APP_TRANSITION_NAME}
      activeKey={activeGroup}
      shouldCleanup
      // cleanupException={CreateChatGroup.Step1}
    >
      {renderScreen()}
    </Transition>
  )
}
export default memo(CreateChat)
