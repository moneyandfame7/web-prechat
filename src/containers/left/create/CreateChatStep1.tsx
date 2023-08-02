import {type FC, memo, useCallback, useEffect} from 'preact/compat'

import {getActions} from 'state/action'
import {getGlobalState} from 'state/signal'
import {FloatButton, Icon, InputText, Divider} from 'components/ui'
import {LeftColumnScreen} from 'types/ui'

import {useInputValue} from 'hooks'

import {LeftGoBack} from '../LeftGoBack'
import {useLeftColumn} from '../context'

import {ChatItem} from 'components/ChatItem'
import {getDisplayedUserName} from 'state/helpers/users'

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
  const {searchUsers, searchGlobalClear} = getActions()
  const {globalSearch, users} = getGlobalState()
  const handleNextStep = useCallback(() => {
    setScreen(isGroup ? LeftColumnScreen.NewGroupStep2 : LeftColumnScreen.NewChannelStep2)
  }, [isGroup])
  const {value, handleInput} = useInputValue({
    cb: (value) => {
      searchUsers(value.currentTarget.value)
    }
  })

  useEffect(() => {
    /* Get contacts here?? */
    return () => {
      searchGlobalClear()
    }
  }, [])

  function renderList() {
    if (!globalSearch.known?.users?.length || !globalSearch.global?.users?.length) {
      return users.contactIds.map((id) => {
        const user = users.byId[id]

        return (
          <ChatItem
            id={user.id}
            key={id}
            title={getDisplayedUserName(user)}
            subtitle="online"
            onClick={() => {
              handleSelect(id)
            }}
            withCheckbox
            checked={selectedIds.includes(id)}
          />
        )
      })
    }

    return (
      <>
        {globalSearch.known.users.map((u) => (
          <ChatItem
            id={u.id}
            withCheckbox
            checked={selectedIds.includes(u.id)}
            key={u.id}
            title={getDisplayedUserName(u)}
            subtitle="online"
            onClick={() => {
              handleSelect(u.id)
            }}
          />
        ))}
        <h3>Global</h3>
        {globalSearch.global.users.map((u) => (
          <ChatItem
            id={u.id}
            withCheckbox
            checked={selectedIds.includes(u.id)}
            key={u.id}
            title={getDisplayedUserName(u)}
            subtitle="online"
            onClick={() => {
              handleSelect(u.id)
            }}
          />
        ))}
      </>
    )
  }
  function renderSelected() {
    return selectedIds.map((id) => <h5>{id}</h5>)
  }

  console.log({selectedIds})
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
      <div class="picker-list scrollable">
        {renderList()}
        <Divider>
          <h3>SELECTED</h3>
        </Divider>
        {renderSelected()}
      </div>

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
