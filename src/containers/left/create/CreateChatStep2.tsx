import {type FC, memo, useState, useCallback, type TargetedEvent} from 'preact/compat'
import {Button, FloatButton, Icon, InputText} from 'components/ui'
import {UploadPhoto} from 'components/UploadPhoto'

import {useLeftColumn} from '../context'
import {LeftGoBack} from '../LeftGoBack'

import {useBoolean} from 'hooks/useFlag'

import styles from './CreateChatStep2.module.scss'
import {getDisplayedUserName} from 'state/helpers/users'
import {getGlobalState} from 'state/signal'
import {ChatItem} from 'components/ChatItem'

export interface CreateChatStep2Props {
  isGroup: boolean
  selectedIds: string[]
}
const CreateChatStep2: FC<CreateChatStep2Props> = ({isGroup, selectedIds}) => {
  const {resetScreen} = useLeftColumn()
  const [name, setName] = useState('')
  const globalState = getGlobalState()
  const [description, setDescription] = useState('')
  const {value: loading, /*  setTrue, setFalse, */ toggle} = useBoolean()
  const handleChangeName = useCallback((e: TargetedEvent<HTMLInputElement, Event>) => {
    const {value} = e.currentTarget

    setName(value)
  }, [])
  const handleChangeDescription = useCallback(
    (e: TargetedEvent<HTMLInputElement, Event>) => {
      const {value} = e.currentTarget

      setDescription(value)
    },
    []
  )

  const handleNextStep = useCallback(() => {
    // setTrue()
    resetScreen(true) // ( just create action, call it and change screen there)
    // setFalse()
  }, [])

  return (
    <>
      <div class="LeftColumn-Header">
        <LeftGoBack force={false} />
        <p class="LeftColumn-Header_title">New {isGroup ? 'Group' : 'Channel'}</p>
      </div>
      <UploadPhoto />
      <div class={styles['chat-info']}>
        <InputText
          label={isGroup ? 'Group Name' : 'Channel Name'}
          onInput={handleChangeName}
          value={name}
        />
        {!isGroup && (
          <InputText
            label="Description (optional)"
            onInput={handleChangeDescription}
            value={description}
          />
        )}
        {!isGroup && (
          <p class={styles.subtitle}>
            You can provide an optional description for your channel.
          </p>
        )}
        {}
        {selectedIds?.length && isGroup && (
          <>
            <p class={styles.membersCount}>{selectedIds.length} members</p>
            <div class={styles.membersList}>
              {selectedIds.map((member) => {
                const user = globalState.users.byId?.[member] || undefined
                return (
                  <ChatItem
                    id={member}
                    key={member}
                    title={getDisplayedUserName(user)}
                    subtitle="online"

                    // withCheckbox
                    // checked={selectedIds.includes(id)}
                  />
                )
              })}
            </div>
          </>
        )}
      </div>
      <Button onClick={toggle}></Button>
      <FloatButton
        isLoading={loading}
        shown={name.length > 0}
        onClick={handleNextStep}
        icon={<Icon name="arrowRight" />}
        aria-label="Next step"
      />
    </>
  )
}

export default memo(CreateChatStep2)
