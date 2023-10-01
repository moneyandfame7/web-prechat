import {useSignal} from '@preact/signals'
import {type FC, type TargetedEvent, memo, useCallback} from 'preact/compat'

import {getActions} from 'state/action'
import {getUserName} from 'state/helpers/users'
import {getGlobalState} from 'state/signal'

import {useBoolean} from 'hooks/useFlag'

import {ColumnHeader} from 'components/ColumnHeader'
import {UploadProfilePhoto} from 'components/UploadPhoto'
import {FloatButton, Icon, InputText} from 'components/ui'

import {LeftGoBack} from '../LeftGoBack'
import {useLeftColumn} from '../context'

import styles from './CreateChatStep2.module.scss'

export interface CreateChatStep2Props {
  isGroup: boolean
  selectedIds: string[]
}
const CreateChatStep2: FC<CreateChatStep2Props> = ({isGroup, selectedIds}) => {
  const {createChannel, createGroup} = getActions()
  const {resetScreen} = useLeftColumn()
  const title = useSignal('')
  const description = useSignal('')
  const globalState = getGlobalState()
  const {value: loading /*  setTrue, setFalse, */, setTrue, setFalse} = useBoolean()
  const handleChangeName = useCallback((e: TargetedEvent<HTMLInputElement, Event>) => {
    const {value} = e.currentTarget

    title.value = value
  }, [])
  const handleChangeDescription = useCallback((e: TargetedEvent<HTMLInputElement, Event>) => {
    const {value} = e.currentTarget

    description.value = value
  }, [])

  const handleNextStep = useCallback(async () => {
    setTrue()
    if (isGroup) {
      await createGroup({
        title: title.value,
        users: selectedIds,
      })
    } else {
      await createChannel({
        title: title.value,
        users: selectedIds,
        description: description.value,
      })
    }
    resetScreen(true)

    setFalse()
  }, [])

  return (
    <>
      <ColumnHeader>
        <LeftGoBack force={false} />

        <p class="column-header__title">New {isGroup ? 'Group' : 'Channel'}</p>
      </ColumnHeader>
      <UploadProfilePhoto />
      <div class={styles['chat-info']}>
        <InputText
          label={isGroup ? 'Group Name' : 'Channel Name'}
          onInput={handleChangeName}
          value={title}
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
                  <p key={member}>{user ? getUserName(user) : 'NOT SELECT USER'}</p>
                  /*      <ListItem
                    userId={member}
                    key={member}
                    title={getDisplayedUserName(user)}
                    subtitle="online"

                    // withCheckbox
                    // checked={selectedIds.includes(id)}
                  /> */
                )
              })}
            </div>
          </>
        )}
      </div>
      <FloatButton
        isLoading={loading}
        shown={title.value.length > 0}
        onClick={handleNextStep}
        icon={<Icon name="arrowRight" />}
        aria-label="Next step"
      />
    </>
  )
}

export default memo(CreateChatStep2)
