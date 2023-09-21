import {type FC, Fragment, memo} from 'preact/compat'
import {useCallback, useRef, useState} from 'preact/hooks'

import {getUserName, getUserStatus} from 'state/helpers/users'
import {selectContacts} from 'state/selectors/users'
import {getGlobalState} from 'state/signal'

import {useInputValue} from 'hooks'

import {fromRecord} from 'utilities/array/fromRecord'

import {LeftColumnScreen} from 'types/ui'

import {ColumnHeader} from 'components/ColumnHeader'
import {Divider, FloatButton, Icon, IconButton, InputText} from 'components/ui'
import {AvatarTest} from 'components/ui/AvatarTest'
import {ListItem} from 'components/ui/ListItem'

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
            <Fragment key={user.id}>
              {/* якщо не працює - змінити onToggleCheckbox */}
              <ListItem
                withCheckbox
                withContextMenuPortal
                isChecked={selectedIds.includes(user.id)}
                onClick={() => {
                  handleSelect(user.id)
                }}
                // withRipple={false}
                title={getUserName(user)}
                subtitle={getUserStatus(user)}
              >
                <AvatarTest size="s" />
              </ListItem>
            </Fragment>
          )
        })}
      </>
    )
  }

  return (
    <>
      <ColumnHeader>
        <IconButton
          icon="arrowLeft"
          onClick={() => {
            setScreen(LeftColumnScreen.Chats)
          }}
        />
        <p class="column-header__title">Add Members</p>
      </ColumnHeader>
      <InputText
        value={value}
        onInput={handleInput}
        variant="default"
        placeholder="Add People..."
      />
      <Divider />
      <div class="picker-list scrollable scrollable-y">{renderList()}</div>
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
