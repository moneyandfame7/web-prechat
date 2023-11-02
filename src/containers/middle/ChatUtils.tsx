import {type FC, memo} from 'preact/compat'

import type {ApiChat, ApiChatMember, ApiUser} from 'api/types'

import {getActions} from 'state/action'
import {type MapState, connect} from 'state/connect'
import {isUserId} from 'state/helpers/users'
import {
  getChatMember,
  isChatChannel,
  isChatGroup,
  selectChat,
  selectChatFull,
} from 'state/selectors/chats'
import {selectHasMessageSelection} from 'state/selectors/diff'
import {selectUser} from 'state/selectors/users'

import {TEST_translate} from 'lib/i18n'

import type {LanguagePackKeys} from 'types/lib'

import {MenuItem} from 'components/popups/menu'
import {MenuDivider} from 'components/popups/menu/Menu'
import {Button, IconButton} from 'components/ui'
import {DropdownMenu} from 'components/ui/DropdownMenu'

interface OwnProps {
  chatId: string
}
interface StateProps {
  user: ApiUser | undefined
  chat: ApiChat | undefined
  chatMember: ApiChatMember | undefined
  isPrivateChat: boolean | undefined
  isChannel: boolean | undefined
  isGroup: boolean | undefined
  canEditChat: boolean | undefined
  hasMessageSelection: boolean
}
const ChatUtilsImpl: FC<OwnProps & StateProps> = ({
  user,
  chat,
  chatMember,
  isChannel,
  // isGroup,
  isPrivateChat,
  canEditChat,
  chatId,
  hasMessageSelection,
}) => {
  const {openPinnedMessages, toggleMessageSelection} = getActions()
  function renderLeaveBtn() {
    let key: LanguagePackKeys
    if (isPrivateChat) {
      key = 'DeleteChat'
    } else if (!isPrivateChat && chat?.isNotJoined) {
      return null
    } else if (chatMember?.isOwner) {
      if (isChannel) {
        key = 'DeleteChannel'
      } else {
        key = 'DeleteGroup'
      }
    } else if (isChannel) {
      key = 'LeaveChannel'
    } else {
      key = 'LeaveGroup'
    }

    return <MenuItem danger icon="delete" title={TEST_translate(key)} />
  }

  const handleToggleSelection = () => {
    toggleMessageSelection({active: !hasMessageSelection})
  }
  const canJoinChat = chat?.isForbidden !== true && chat?.isNotJoined
  // const canDeleteChat = chat && chat.lastMessage // ????
  return (
    <div class="chat-utils">
      {canJoinChat && (
        <Button bold={false} shape="rounded" fullWidth={false}>
          {TEST_translate(isChannel ? 'Subscribe' : 'Join')}
        </Button>
      )}

      <IconButton icon="mute" />
      <IconButton
        icon="pinlist"
        onClick={() => {
          openPinnedMessages({id: chatId})
        }}
      />

      <IconButton icon="search" />
      <DropdownMenu
        transform="top right"
        placement={{top: true, right: true}}
        button={<IconButton icon="more" />}
      >
        {chat?.isMuted ? (
          <MenuItem icon="unmute" title="Unmute" />
        ) : (
          <MenuItem icon="mute" title="Mute" />
        )}
        {/* {chat?.isOwner||chat.is} */}

        {canEditChat && <MenuItem icon="edit" title="Edit" />}
        {user && user?.isContact && <MenuItem icon="forward" title="Share contact" />}

        <MenuItem
          onClick={handleToggleSelection}
          icon="select"
          title={hasMessageSelection ? 'Clear Selection' : 'Select Messages'}
        />
        <MenuDivider />
        {user &&
          (user?.isBlocked ? (
            <MenuItem icon="lockOff" title="Unblock" />
          ) : (
            <MenuItem icon="lock" title="Block user" />
          ))}
        {user &&
          (user?.isContact ? (
            <MenuItem icon="deleteUser" title="Delete Contact" />
          ) : (
            <MenuItem icon="addUser" title="Add to contacts" />
          ))}
        {/* {canDeleteChat && (
          <MenuItem
            icon="delete"
            danger
            title={isChannel ? 'Delete Channel' : isGroup ? 'Delete Group' : 'Delete Chat'}
          />
        )} */}

        {renderLeaveBtn()}
        {/* <MenuItem icon="delete" danger title="Delete Group" />
        <MenuItem icon="delete" danger title="Delete Channel" />
        <MenuItem icon="delete" danger title="Leave Group" />
        <MenuItem icon="delete" danger title="Leave Channel" /> */}
      </DropdownMenu>
      {/* */}
    </div>
  )
}

const mapStateToProps: MapState<OwnProps, StateProps> = (state, ownProps) => {
  const chat = selectChat(state, ownProps.chatId)
  const user = isUserId(ownProps.chatId) ? selectUser(state, ownProps.chatId) : undefined

  const chatFull = !isUserId(ownProps.chatId)
    ? selectChatFull(state, ownProps.chatId)
    : undefined
  const chatMember = chatFull && getChatMember(chatFull, state.auth.userId!)
  const canEditChat =
    (user && user.isContact) ||
    chatMember?.isOwner ||
    chatMember?.isAdmin /* && chatMember?.adminPermissions?.canChangeInfo */
  const hasMessageSelection = selectHasMessageSelection(state)
  return {
    chat,
    user,
    isChannel: chat && isChatChannel(chat),
    isGroup: chat && isChatGroup(chat),
    isPrivateChat: !!user || isUserId(ownProps.chatId),
    chatMember,
    canEditChat,
    hasMessageSelection,
  }
}

export const ChatUtils = memo(connect(mapStateToProps)(ChatUtilsImpl))
