import {type FC, memo} from 'preact/compat'
import {useCallback, useRef, useState} from 'preact/hooks'

import {useInputValue} from 'hooks'

import {getDisplayedUserName} from 'state/helpers/users'
import {selectContacts} from 'state/selectors/users'
import {getGlobalState} from 'state/signal'

import {fromRecord} from 'utilities/array/fromRecord'

import {LeftColumnScreen} from 'types/ui'

import {Divider, FloatButton, Icon, InputText} from 'components/ui'

import {LeftGoBack} from '../LeftGoBack'
import {useLeftColumn} from '../context'

import './CreateChatStep1.scss'

export interface CreateChatStep1Props {
  isGroup: boolean
  selectedIds: string[]
  handleSelect: (id: string) => void
}

const CreateChatStep1: FC<CreateChatStep1Props> = ({isGroup, selectedIds, handleSelect}) => {
  const {setScreen} = useLeftColumn()
  const global = getGlobalState()
  const [filteredList, setFilteredList] = useState(fromRecord(selectContacts(global)))
  const handleNextStep = useCallback(() => {
    setScreen(isGroup ? LeftColumnScreen.NewGroupStep2 : LeftColumnScreen.NewChannelStep2)
  }, [isGroup])

  const {value, handleInput} = useInputValue({
    cb: (e) => {
      const {value} = e.currentTarget

      if (value.length === 0) {
        setFilteredList(fromRecord(selectContacts(global)))
      } else {
        setFilteredList((prev) => prev.filter((u) => u.username?.includes(value)))
      }
    },
  })
  const render = useRef(0)
  render.current += 1
  function renderList() {
    return (
      <>
        {filteredList.map((user) => {
          return (
            <p key={user.id}>{getDisplayedUserName(user)}</p>
            /*    <ListItem
              userId={user.id}
              user={user}
              key={user.id}
              title={getDisplayedUserName(user)}
              subtitle={user.username ? `@${user.username}` : undefined}
              onClick={() => {
                handleSelect(user.id)
              }}
              withCheckbox
              checked={selectedIds.includes(user.id)}
            /> */
          )
        })}
      </>
    )
  }

  return (
    <>
      <div class="LeftColumn-Header">
        <LeftGoBack />
        <p class="LeftColumn-Header_title">Add Members {render.current}</p>
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
        <p key={id}>{global.users.byId[id].firstName}</p>
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
