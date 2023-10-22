import {type FC, memo} from 'preact/compat'

import type {ApiChat, ApiMessage, ApiUser} from 'api/types'

import {type MapState, connect} from 'state/connect'
import {getUserName, isUserId} from 'state/helpers/users'
import {selectMessagesSelectionCount} from 'state/selectors/diff'
import {selectUser} from 'state/selectors/users'

import {TEST_translate} from 'lib/i18n'

import {renderText} from 'utilities/parse/render'

import {Checkbox} from 'components/ui'

import ConfirmModalAsync from './ConfirmModal.async'

export interface OwnProps {
  chat: ApiChat | undefined
  isOpen: boolean
  onClose: VoidFunction
  message?: ApiMessage
}

interface StateProps {
  selectedMessagesCount: number
  partner: ApiUser | undefined
}
const DeleteMessagesModalImpl: FC<OwnProps & StateProps> = ({
  isOpen,
  onClose,
  chat,
  selectedMessagesCount,
  message,
  partner,
}) => {
  /**
   * Selected messages, sort, якщо є моє повідомлення і я можу його видалити для всіх - показувати повідомлення і ляля тополя
   */
  const handleDeleteMessages = () => {}
  return (
    <ConfirmModalAsync
      chat={chat}
      user={partner}
      title={TEST_translate('DeleteMessages', {count: message ? 1 : selectedMessagesCount})}
      action="Delete"
      content={
        <>
          {TEST_translate('AreYouSureDeleteMessages', {
            count: message ? 1 : selectedMessagesCount,
          })}
          {partner && (
            <Checkbox
              label={renderText(
                TEST_translate('AlsoDeleteFor', {name: getUserName(partner)}),
                ['markdown']
              )}
            />
          )}
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
    selectedMessagesCount: selectMessagesSelectionCount(state),
    partner: isPrivate ? selectUser(state, ownProps.chat!.id) : undefined,
  }
}

export default memo(connect(mapStateToProps)(DeleteMessagesModalImpl))
