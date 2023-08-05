import {type FC, memo} from 'preact/compat'
import {useCallback} from 'preact/hooks'
import {getActions} from 'state/action'
import {getGlobalState} from 'state/signal'
import {FloatButton, Icon, InputText, Divider} from 'components/ui'
import {LeftColumnScreen} from 'types/ui'

import {useInputValue} from 'hooks'

import {ChatItem} from 'components/ChatItem'
import {ScreenLoader} from 'components/ScreenLoader'

import {getDisplayedUserName} from 'state/helpers/users'

import {LeftGoBack} from '../LeftGoBack'
import {useLeftColumn} from '../context'

import './CreateChatStep1.scss'

export interface CreateChatStep1Props {
  isGroup: boolean
  selectedIds: string[]
  handleSelect: (id: string) => void
}

const CreateChatStep1: FC<CreateChatStep1Props> = ({
  isGroup,
  selectedIds,
  handleSelect
}) => {
  const {setScreen} = useLeftColumn()
  const {searchUsers} = getActions()
  const {globalSearch, users} = getGlobalState()
  const handleNextStep = useCallback(() => {
    setScreen(isGroup ? LeftColumnScreen.NewGroupStep2 : LeftColumnScreen.NewChannelStep2)
  }, [isGroup])

  const {value, handleInput} = useInputValue({
    cb: (value) => {
      searchUsers(value.currentTarget.value)
    }
  })

  function renderList() {
    if (!value.length) {
      return (
        <>
          <h5 class="subtitle">Contacts</h5>
          {users.contactIds.map((id) => {
            const user = users.byId[id]

            return (
              <ChatItem
                userId={user.id}
                user={user}
                key={id}
                title={getDisplayedUserName(user)}
                subtitle={user.username ? `@${user.username}` : undefined}
                onClick={() => {
                  handleSelect(id)
                }}
                withCheckbox
                checked={selectedIds.includes(id)}
              />
            )
          })}
        </>
      )
    }
    if (globalSearch.isLoading) {
      return <ScreenLoader />
    }
    if (!globalSearch.known?.users?.length && !globalSearch.global?.users?.length) {
      return <h4>No results </h4>
    }

    return (
      <>
        <h5 class="subtitle">Contacts</h5>
        {globalSearch.known?.users?.map((u) => (
          <ChatItem
            user={u}
            userId={u.id}
            withCheckbox
            checked={selectedIds.includes(u.id)}
            key={u.id}
            title={getDisplayedUserName(u)}
            subtitle={`@${u.username}`}
            onClick={() => {
              handleSelect(u.id)
            }}
          />
        ))}
        <h5 class="subtitle">Global</h5>
        {globalSearch.global?.users?.map((u) => (
          <ChatItem
            user={u}
            userId={u.id}
            withCheckbox
            checked={selectedIds.includes(u.id)}
            key={u.id}
            title={getDisplayedUserName(u)}
            subtitle={`@${u.username}`}
            onClick={() => {
              handleSelect(u.id)
            }}
          />
        ))}
      </>
    )
  }

  return (
    <>
      <div class="LeftColumn-Header">
        <LeftGoBack />
        <p class="LeftColumn-Header_title">Add Members</p>
      </div>
      <InputText
        value={value}
        onInput={handleInput}
        variant="default"
        placeholder="Add People..."
      />
      <Divider />
      <div class="picker-list scrollable">{renderList()}</div>
      {selectedIds.map((id) => (
        <p>{users.byId[id].firstName}</p>
      ))}
      <FloatButton
        shown
        onClick={handleNextStep}
        icon={<Icon name="arrowRight" />}
        aria-label="Next step"
      />
    </>
  )
}

export default memo(CreateChatStep1)
