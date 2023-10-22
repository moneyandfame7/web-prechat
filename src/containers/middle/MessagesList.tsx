import {type FC, memo, useEffect, useLayoutEffect, useMemo, useRef} from 'preact/compat'

import clsx from 'clsx'

import type {ApiChat} from 'api/types'
import {type ApiMessage} from 'api/types/messages'

import {getActions} from 'state/action'
import {type MapState, connect} from 'state/connect'
import {isUserId} from 'state/helpers/users'
import {
  isChatChannel,
  isChatGroup,
  selectChat,
  selectIsChatWithSelf,
  selectIsMessagesLoading,
} from 'state/selectors/chats'
import {selectHasMessageSelection} from 'state/selectors/diff'
import {
  selectChatMessageIds,
  selectMessages,
  selectPinnedMessageIds,
} from 'state/selectors/messages'

import {useIsFirstRender} from 'hooks/useIsFirstRender'

import {formatMessageGroupDate} from 'utilities/date/convert'

import {SingleTransition} from 'components/transitions'
import {Loader} from 'components/ui/Loader'

import {NoMessages} from './NoMessages'
import {MessageBubblesGroup} from './message/MessageGroup'

import './MessagesList.scss'

type OwnProps = {
  chatId: string
  isPinnedList?: boolean
}

type StateProps = {
  messageIds?: string[]
  messagesById?: Record<string, ApiMessage>
  isMessagesLoading?: boolean
  isSavedMessages: boolean
  chat?: ApiChat
  isPrivateChat?: boolean
  isChannel?: boolean
  isGroup?: boolean
  hasMessageSelection: boolean
}
interface MessageGroup {
  date: string
  ids: string[]
}

function getTimestamp(message: ApiMessage | undefined) {
  return message ? new Date(message.createdAt).getTime() : null
}
function removeEmptyNestedArrays<T>(arr: T[]) {
  return arr.filter((item) => (Array.isArray(item) ? item.length > 0 : true))
}
/**
 * @todo views, sending status icon,
 * group by date + group by time
 */
const MessagesListImpl: FC<OwnProps & StateProps> = ({
  messageIds,
  messagesById,
  chatId,
  isMessagesLoading,
  chat,
  isSavedMessages,
  isChannel,
  isGroup,
  isPrivateChat,
  isPinnedList,
  hasMessageSelection,
}) => {
  const {getHistory, getPinnedMessages} = getActions()
  const listRef = useRef<HTMLDivElement>(null)
  /* Initial scroll in bottom of the list. */
  useEffect(() => {
    if (isPinnedList) {
      getPinnedMessages({chatId})
    } else {
      getHistory({chatId, limit: 100 /* direction: HistoryDirection.Around */})
    }
  }, [chatId, isPinnedList])

  /**
   * If has unread messages, scroll to first unread message.
   */
  useLayoutEffect(() => {
    if (!listRef.current) {
      return
    }

    console.log('SCROLL TO BOTTOM?')
    listRef.current.scrollTo({top: listRef.current.scrollHeight})
  }, [chatId])
  useLayoutEffect(() => {
    if (!listRef.current) {
      return
    }
    // listRef.current.scrollTo({
    //   top: listRef.current.scrollHeight,
    //   behavior: 'smooth',
    // })
    listRef.current.scrollTo({top: listRef.current.scrollHeight})
  }, [messageIds])
  // console.log('MILLIONS RERENDERS:')

  const dateGroup = useMemo(() => {
    const groups: MessageGroup[] = []
    let currentDate = ''
    messageIds?.forEach((id) => {
      const message = messagesById?.[id]
      if (message?.deleteLocal) {
        console.log('IT DELETED LOCAL AUU!!!', message)
        return
      }
      const date = message?.createdAt && new Date(message.createdAt).toDateString()

      /* так ми робимо action окремо від звичайних повідомлень
      щоб не було проблем з аватаркою
      */
      /*       if (date && message.action) {
        groups.push({date, ids: [id]})
      } else  */ if (date && date !== currentDate) {
        groups.push({date, ids: [id]})
        currentDate = date
      } else {
        const lastGroup = groups[groups.length - 1]
        lastGroup.ids.push(id)
      }
    })

    return groups
  }, [messageIds, chatId])

  // const groups = useMemo(() => {
  //   const groups: string[][] = []
  //   let currentGroup: string[] = []
  //   let previousTimestamp: number | null = null
  //   let previousSenderId: string | null = null
  //   messageIds?.forEach((id) => {
  //     const message = messagesById?.[id]

  //     // Перевіряємо автора
  //     if (previousSenderId && previousSenderId !== message?.senderId) {
  //       // Новий автор - нова група
  //       groups.push(currentGroup)
  //       currentGroup = []
  //     }

  //     // Перевіряємо час
  //     const timestamp = message ? new Date(message.createdAt).getTime() : null

  //     if (
  //       timestamp &&
  //       (!previousTimestamp || timestamp - previousTimestamp > 10 * 60 * 1000)
  //     ) {
  //       groups.push(currentGroup)
  //       currentGroup = []
  //     }

  //     // Додаємо повідомлення в групу
  //     currentGroup.push(id)

  //     previousSenderId = message?.senderId || null
  //     previousTimestamp = timestamp
  //   })
  //   if (currentGroup.length) {
  //     groups.push(currentGroup)
  //   }

  //   return groups.filter((v) => (Array.isArray(v) ? v.length > 0 : v))
  // }, [messageIds, messagesById])

  const combined = useMemo(() => {
    console.time('COMBINED_DATE')
    const grouped: {date: string; ids: string[][]}[] = []

    dateGroup.forEach((group) => {
      const subgroups: string[][] = []
      let currentSubGroup: string[] = []

      let prevSenderId: string | null = null
      let prevTimestamp: number | null = null

      group.ids.forEach((id) => {
        const message = messagesById?.[id]
        /* idk how to handle message that can be undefined */
        if (message?.senderId && prevSenderId && prevSenderId !== message.senderId) {
          if (currentSubGroup.length) {
            subgroups.push(currentSubGroup)
          }
          currentSubGroup = []
        }
        const timestamp = getTimestamp(message)

        if (timestamp && (!prevTimestamp || timestamp - prevTimestamp > 10 * 60 * 1000)) {
          if (currentSubGroup.length) {
            subgroups.push(currentSubGroup)
          }
          currentSubGroup = []
        }

        currentSubGroup.push(id)

        prevSenderId = message?.senderId || null
        prevTimestamp = timestamp
      })

      if (currentSubGroup.length) {
        subgroups.push(currentSubGroup)
      }

      grouped.push({
        date: group.date,
        ids: subgroups,
      })
    })

    console.timeEnd('COMBINED_DATE')

    return grouped
  }, [dateGroup])

  const emptyList = messageIds?.length === 0
  const shouldRenderNoMessage =
    messageIds?.length === 0 ||
    (messageIds?.length === 1 && chat?.lastMessage?.action?.type === 'chatCreate')
  // console.log({})

  const buildedClass = clsx('messages-list scrollable', {
    'is-selecting': hasMessageSelection,
    'is-pinned': isPinnedList,
  })

  return (
    <div class={buildedClass} ref={listRef}>
      {/* <Spinner absoluted zoom size="medium" color="white" /> */}
      <Loader isVisible={!messageIds} isLoading />
      {/* {chatId} */}
      <SingleTransition
        className="messages-loading-transition"
        in={!!messageIds}
        name="zoomFade"
        timeout={250}
      >
        <div class={`messages-container ${emptyList ? 'empty' : ''}`}>
          {shouldRenderNoMessage && (
            <NoMessages
              isPinnedList={isPinnedList}
              isChannel={isChannel}
              isPrivate={isPrivateChat}
              isGroup={isGroup}
              lastMessage={chat?.lastMessage}
              type={chat?.type}
              isSavedMessages={isSavedMessages}
            />
          )}
          {/*
          {dateGroup.map((group) => {
            return (
              <div class="message-date-group" key={group.date}>
                <div class="message-item bubble action is-date">
                  <div class="message-content">
                  // Sticky date
                    {formatMessageGroupDate(new Date(group.date))}
                  </div>
                </div>
                {group.ids.map((id) => (
                  <MessageItem key={id} chatId={chatId} messageId={id} />
                ))}
              </div>
            )
          })} */}

          {combined.map((group) => {
            const groupDate = formatMessageGroupDate(new Date(group.date))

            return (
              <div key={`${groupDate}${chatId}`} class="message-date-group">
                <div class="bubble action is-date">
                  {/* Sticky date  */}
                  <div class="bubble-content">{groupDate}</div>
                </div>
                {group.ids.map((groups, idx) => {
                  // const groupSender=select
                  // const message=
                  // return (
                  //   <div class="messages-group" key={idx}>
                  //     <div class="messages-group-avatar-container">
                  //       <div
                  //         class="messages-group-avatar"
                  //         style={{
                  //           borderRadius: '50%',
                  //           backgroundColor: 'red',
                  //           width: 25,
                  //           height: 25,
                  //         }}
                  //       />
                  //     </div>
                  //     {groups.map((id) => (
                  //       <MessageItem key={id} chatId={chatId} messageId={id} />
                  //     ))}
                  //   </div>
                  // )

                  return <MessageBubblesGroup key={idx} chatId={chatId} groupIds={groups} />
                })}
              </div>
            )
          })}
          {/* {messageIds?.map((id, i) => (
            <MessageItem key={id} chatId={chatId} messageId={id} />
          ))} */}
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
  const messageIds = ownProps.isPinnedList
    ? selectPinnedMessageIds(state, chatId)
    : selectChatMessageIds(state, chatId)
  const isMessagesLoading = selectIsMessagesLoading(state)
  const isSavedMessages = selectIsChatWithSelf(state, chatId)
  const chat = selectChat(state, chatId)
  const isPrivateChat = isUserId(chatId)
  const isChannel = chat && isChatChannel(chat)
  const isGroup = chat && isChatGroup(chat)
  const hasMessageSelection = selectHasMessageSelection(state)
  return {
    messagesById,
    messageIds,
    isMessagesLoading,
    chat,
    isSavedMessages,
    isPrivateChat,
    isChannel,
    isGroup,
    hasMessageSelection,
  }
}

export const MessagesList = memo(connect(mapStateToProps)(MessagesListImpl))
