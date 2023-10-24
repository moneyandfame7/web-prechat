import {type FC, memo} from 'preact/compat'

import clsx from 'clsx'

import type {ApiMessage, ApiUser} from 'api/types'

import {getActions} from 'state/action'
import {connect} from 'state/connect'
import {getUserName} from 'state/helpers/users'
import {selectHasMessageEditing} from 'state/selectors/diff'
import {selectMessage} from 'state/selectors/messages'
import {selectUser} from 'state/selectors/users'

import {TEST_translate} from 'lib/i18n'

import {renderText} from 'utilities/parse/render'

import type {PreactNode} from 'types/ui'

import {Icon, IconButton} from 'components/ui'

import './MessageHelper.scss'

interface OwnProps {
  chatId: string
}

interface StateProps {
  message: ApiMessage | undefined
  sender: ApiUser | undefined
  isEditing: boolean
  isReply: boolean
}
const MessageHelperImpl: FC<StateProps> = ({message, sender, isEditing}) => {
  const {toggleMessageEditing} = getActions()
  const buildedClass = clsx('message-helper')

  const handleCloseHelper = () => {
    toggleMessageEditing({active: false})
  }

  const handleClickContent = () => {
    console.log({message})
  }
  function renderTitle() {
    let title: PreactNode | undefined
    if (isEditing) {
      title = TEST_translate('EditMessage')
    } else {
      title = sender ? getUserName(sender) : undefined
    }
    return <p class="helper-content__title">{title}</p>
  }
  return (
    <>
      <div class={buildedClass}>
        <Icon color="primary" name="edit" />

        <div class="message-helper-content" onMouseDown={handleClickContent}>
          <div class="message-helper-divider" />

          <div class="helper-content__wrapper">
            {renderTitle()}

            {message?.text && (
              <p class="helper-content__subtitle">{renderText(message?.text, ['emoji'])}</p>
            )}
          </div>
        </div>
        <IconButton icon="close" onClick={handleCloseHelper} />

        {/* <Divider orientation="vertical" primary /> */}
      </div>
    </>
  )
}

export const MessageHelper = memo(
  connect<OwnProps, StateProps>((state, ownProps) => {
    const messageEditing = state.messageEditing
    const message = messageEditing.messageId
      ? selectMessage(state, ownProps.chatId, messageEditing.messageId)
      : undefined
    const sender = message?.senderId ? selectUser(state, message.senderId) : undefined
    return {
      message,
      sender,
      isReply: false,
      isEditing: selectHasMessageEditing(state),
    }
  })(MessageHelperImpl)
)
