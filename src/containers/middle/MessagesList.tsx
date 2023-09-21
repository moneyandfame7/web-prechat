import {type FC, memo, useEffect, useLayoutEffect, useRef, useState} from 'preact/compat'

import type {ApiChat} from 'api/types'
import type {ApiMessage} from 'api/types/messages'

import {getActions} from 'state/action'
import {type MapState, connect} from 'state/connect'
import {selectIsMessagesLoading} from 'state/selectors/chats'
import {selectChatMessageIds, selectMessages} from 'state/selectors/messages'

import {useIsFirstRender} from 'hooks/useIsFirstRender'

import {SingleTransition} from 'components/transitions'
import {Button} from 'components/ui'
import {Loader} from 'components/ui/Loader'

import {MessageItem} from './MessageItem'

import './MessagesList.scss'

type OwnProps = {
  chatId: string
}

type StateProps = {
  messageIds?: string[]
  messagesById?: Record<string, ApiMessage>
  isMessagesLoading?: boolean
}
/**
 * @todo views, sending status icon,
 * group by date + group by time
 */
const MessagesListImpl: FC<OwnProps & StateProps> = ({
  messageIds,
  chatId,
  isMessagesLoading,
}) => {
  const {getMessages} = getActions()
  const isFirstRender = useIsFirstRender()
  const listRef = useRef<HTMLDivElement>(null)
  /* Initial scroll in bottom of the list. */
  useEffect(() => {
    getMessages({chatId, limit: 50, offset: 0})
  }, [chatId])
  useLayoutEffect(() => {
    if (!listRef.current) {
      return
    }
    listRef.current.scrollTo({top: listRef.current.scrollHeight})
  }, [chatId])
  useLayoutEffect(() => {
    if (!listRef.current || isFirstRender) {
      return
    }
    listRef.current.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messageIds])
  // console.log('MILLIONS RERENDERS:')

  const shouldDisplayLoader = isMessagesLoading && !messageIds

  return (
    <div class="messages-list scrollable" ref={listRef}>
      {/* <Spinner absoluted zoom size="medium" color="white" /> */}
      <Loader isVisible={!messageIds} isLoading />

      <SingleTransition
        className="messages-loading-transition"
        in={!!messageIds}
        name="zoomFade"
        timeout={250}
      >
        <div class="messages-container">
          {messageIds?.map((id, i) => (
            <MessageItem key={id} chatId={chatId} messageId={id} />
          ))}
          {/* <ListItem title="Lol" subtitle="eshkere"></ListItem> */}
          {/* <ScreenLoader zoom size="medium" color="white" withBg={false} /> */}

          {/* <MessageItem /> */}
        </div>
      </SingleTransition>
    </div>
  )
}

const mapStateToProps: MapState<OwnProps, StateProps> = (state, ownProps) => {
  const {chatId} = ownProps
  const messagesById = selectMessages(state, chatId)
  const messageIds = selectChatMessageIds(state, chatId)
  const isMessagesLoading = selectIsMessagesLoading(state)
  return {
    messagesById,
    messageIds,
    isMessagesLoading,
  }
}

export const MessagesList = memo(connect(mapStateToProps)(MessagesListImpl))
