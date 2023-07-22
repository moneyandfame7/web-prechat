import {type FC, memo, useState, useCallback, type TargetedEvent} from 'preact/compat'
import {Button, FloatButton, Icon, InputText} from 'components/ui'
import {UploadPhoto} from 'components/UploadPhoto'

import {useLeftColumn} from '../context'
import {LeftGoBack} from '../LeftGoBack'

import styles from './CreateChatStep2.module.scss'
import {useBoolean} from 'hooks/useFlag'

export interface CreateChatStep2Props {
  isGroup: boolean
  members?: string[]
}
const CreateChatStep2: FC<CreateChatStep2Props> = ({isGroup, members}) => {
  const {resetScreen} = useLeftColumn()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const {value: loading, setTrue, setFalse, toggle} = useBoolean()
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

  console.log('RERENDER')
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
        {members?.length && isGroup && (
          <>
            <p class="members-count">{members.length} members</p>
            <div class="members-list">
              {members.map((member) => (
                <p>{member}</p>
              ))}
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
