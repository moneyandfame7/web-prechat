import {type FC, memo, useMemo} from 'preact/compat'

import type {ApiChat, ApiMessage, ApiUser} from 'api/types'

import {getActions} from 'state/action'
import {type MapState, connect} from 'state/connect'
import {isUserId} from 'state/helpers/users'
import {selectSelectedMessageIds} from 'state/selectors/diff'
import {selectUser} from 'state/selectors/users'

import {TEST_translate} from 'lib/i18n'

import {filterUnique} from 'utilities/array/filterUnique'

import ConfirmModalAsync from './ConfirmModal.async'

export interface OwnProps {
  chat: ApiChat | undefined
  isOpen: boolean
  onClose: VoidFunction
  message?: ApiMessage
}

interface StateProps {
  selectedMessageIds: string[]
  partner: ApiUser | undefined
}
const DeleteMessagesModalImpl: FC<OwnProps & StateProps> = ({
  isOpen,
  onClose,
  chat,
  selectedMessageIds,
  message,
  partner,
}) => {
  const {deleteMessages, toggleMessageSelection} = getActions()

  /**
   * Selected messages, sort, якщо є моє повідомлення і я можу його видалити для всіх - показувати повідомлення і ляля тополя
   */
  const idsToDelete = useMemo(
    () => filterUnique([...selectedMessageIds, message?.id]).filter(Boolean) as string[],
    [message, selectSelectedMessageIds]
  )
  const handleDeleteMessages = () => {
    if (!chat) {
      return
    }
    deleteMessages({ids: idsToDelete, chatId: chat.id})
    toggleMessageSelection({active: false})
  }

  return (
    <ConfirmModalAsync
      chat={chat}
      user={partner}
      title={TEST_translate('DeleteMessages', {count: idsToDelete.length})}
      action="Delete"
      content={
        <>
          {TEST_translate('AreYouSureDeleteMessages', {
            count: idsToDelete.length,
          })}
          {/* <p class="text-small text-secondary text-end mt-10">
            *It will be deleted for everyone
          </p> */}
          {/* {partner && (
            <Checkbox
              onToggle={toggleDeleteForAll}
              checked={shouldDeleteForAll}
              label={renderText(
                TEST_translate('AlsoDeleteFor', {name: getUserName(partner)}),
                ['markdown']
              )}
            />
          )} */}
        </>
      }
      callback={handleDeleteMessages}
      isOpen={isOpen}
      onClose={onClose}
    />
  )
}

const mapStateToProps: MapState<OwnProps, StateProps> = (state, ownProps) => {
  // chat: selectChat(state, ownProps.chatId),
  const isPrivate = ownProps.chat && isUserId(ownProps.chat.id)
  return {
    selectedMessageIds: selectSelectedMessageIds(state),
    partner: isPrivate ? selectUser(state, ownProps.chat!.id) : undefined,
  }
}

export default memo(connect(mapStateToProps)(DeleteMessagesModalImpl))
