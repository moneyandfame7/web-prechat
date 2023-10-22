import {useComputed} from '@preact/signals'
import {type FC, memo, useLayoutEffect, useRef} from 'preact/compat'

import type {ApiChat, ApiChatFull, ApiUser} from 'api/types'

import {getActions} from 'state/action'
import {type MapState, connect} from 'state/connect'
import {getUserName, isUserId} from 'state/helpers/users'
import {selectChat, selectChatFull} from 'state/selectors/chats'
import {selectUser} from 'state/selectors/users'
import {getGlobalState} from 'state/signal'

// import {updateChat} from 'state/updates'
import {useBoolean} from 'hooks/useFlag'
import {useSignalForm} from 'hooks/useSignalForm'

import {TEST_translate} from 'lib/i18n'

import type {ChatEditScreens} from 'types/screens'

import {ColumnSection} from 'containers/left/ColumnSection'

import {ColumnWrapper} from 'components/ColumnWrapper'
import ConfirmModal from 'components/popups/ConfirmModal.async'
import {Button, FloatButton, Icon, InputText} from 'components/ui'
import {AvatarTest} from 'components/ui/AvatarTest'
import {ListItem} from 'components/ui/ListItem'

export interface ChatEditProps {
  chatId: string
  onCloseScreen: () => void
  currentScreen: ChatEditScreens
}
interface StateProps {
  user: ApiUser | undefined
  chat: ApiChat | undefined
  chatFull: ApiChatFull | undefined
}
const ChatEdit: FC<ChatEditProps & StateProps> = ({
  chatId,
  onCloseScreen,
  user,
  chat,
  chatFull,
}) => {
  const inputRef1 = useRef<HTMLInputElement>(null)
  const inputRef2 = useRef<HTMLInputElement>(null)
  const {updateContact, deleteContact, updateChat} = getActions()

  const [inputValue1, changeValue1] = useSignalForm()
  const [inputValue2, changeValue2] = useSignalForm()

  const handleEditPeer = async () => {
    if (user) {
      await updateContact({
        userId: user.id,
        firstName: inputValue1.value,
        lastName: inputValue2.value,
      })
    } else if (chat) {
      await updateChat({
        chatId: chat.id,
        title: inputValue1.value,
        description: inputValue2.value,
      })
    }

    inputRef1.current?.blur()
    inputRef2.current?.blur()
  }

  useLayoutEffect(() => {
    if (user) {
      changeValue1(user?.firstName.trim())
      changeValue2(user.lastName?.trim() || '')
    } else if (chat) {
      changeValue1(chat.title.trim())
      changeValue2(chatFull?.description?.trim() || '')
    }
  }, [user, chat])
  const toggleChatNotifications = () => {
    // updateChat(getGlobalState(), chatId, {
    //   isMuted: !chat?.isMuted,
    // })
  }

  const handleDeleteContact = () => {
    deleteContact({userId: chatId})
  }
  const {
    value: isDeleteModalOpen,
    setTrue: openDeleteModal,
    setFalse: closeDeleteModal,
  } = useBoolean()

  const areInputsChanged = useComputed(() =>
    user
      ? user.firstName.trim() !== inputValue1.value ||
        user.lastName?.trim() !== inputValue2.value
      : chat?.title.trim() !== inputValue1.value ||
        chatFull?.description?.trim() !== inputValue2.value
  )
  // const
  function renderUserInfo(user: ApiUser) {
    return (
      <>
        <ColumnSection>
          <AvatarTest size="xxl" peer={user} />
          <h4 class="text-bold text-large mt-15">{getUserName(user)}</h4>
          <span class="text-secondary text-small mb-15">original name</span>
          <div class="input-wrapper">
            <InputText
              elRef={inputRef1}
              value={inputValue1}
              onInput={(e) => {
                changeValue1(e.currentTarget.value)
              }}
              label={TEST_translate('FirstNameRequired')}
            />
            <InputText
              elRef={inputRef2}
              value={inputValue2}
              onInput={(e) => {
                changeValue2(e.currentTarget.value)
              }}
              label={TEST_translate('LastNameOptional')}
            />
          </div>
          {chat && (
            <ListItem
              // onToggleCheckbox={}
              onClick={toggleChatNotifications}
              isChecked={!chat.isMuted}
              title="Notifications"
              subtitle="Enabled"
              withCheckbox
            />
          )}
          {/* <Checkbox withRipple fullWidth label="Notifications" subtitle="Enabled" /> */}
        </ColumnSection>

        <ColumnSection>
          <Button
            onClick={openDeleteModal}
            color="red"
            variant="transparent"
            icon="delete"
            iconPosition="start"
            contentPosition="start"
            bold={false}
            uppercase={false}
          >
            Delete Contact
          </Button>
        </ColumnSection>

        <ConfirmModal
          user={user}
          chat={chat}
          title={TEST_translate('DeleteContact')}
          action={TEST_translate('Delete')}
          callback={handleDeleteContact}
          content={TEST_translate('AreYouSureDeleteContact')}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      </>
    )
  }
  return (
    <>
      <ColumnWrapper title="Edit" onGoBack={onCloseScreen}>
        {/* Chat edit {chatId} */}
        {user ? renderUserInfo(user) : 'chat edit'}
      </ColumnWrapper>

      <FloatButton
        className="chat-edit-btn"
        isDisabled={false}
        // aria-label=
        onClick={handleEditPeer}
        aria-label="Submit changes"
        shown={areInputsChanged.value}
        icon={<Icon name="check" />}
      />
    </>
  )
}

const mapStateToProps: MapState<ChatEditProps, StateProps> = (state, ownProps) => {
  const isPrivate = isUserId(ownProps.chatId)
  const user = isPrivate ? selectUser(state, ownProps.chatId) : undefined
  const chat = selectChat(state, ownProps.chatId)
  return {
    user,
    chat,
    chatFull: selectChatFull(state, ownProps.chatId),
  }
}

export default memo(connect(mapStateToProps)(ChatEdit))
