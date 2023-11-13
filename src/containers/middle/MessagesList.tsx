import {
  type FC,
  type RefObject,
  memo,
  startTransition,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/compat'

import clsx from 'clsx'
import {VList, type VListHandle} from 'virtua'

import type {ApiChat, ApiLangCode} from 'api/types'
import {type ApiMessage, HistoryDirection} from 'api/types/messages'

import {getActions} from 'state/action'
import {type MapState, connect} from 'state/connect'
import {getFirstUnreadMessage} from 'state/helpers/messages'
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

import {formatMessageGroupDate} from 'utilities/date/convert'
import {logger} from 'utilities/logger'
import {debounce} from 'utilities/schedulers/debounce'

import type {GetHistoryPayload} from 'types/action'

import {SingleTransition} from 'components/transitions'
import {Loader} from 'components/ui/Loader'

import {NoMessages} from './NoMessages'
import {MessageBubble, VirtualScrollItem} from './message/MessageBubble'

import './MessagesList.scss'

type OwnProps = {
  chatId: string
  isPinnedList?: boolean
  infiniteScrollRef: RefObject<VListHandle>
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
  language: ApiLangCode
}
interface MessageGroup {
  date: string
  ids: string[]
}
const THRESHOLD = 20
const GET_HISTORY_LIMIT = 40

const debounceGetHistory = debounce((cb) => cb(), 250, true)
/**
 @todo fix: sending message status
 @todo refactor: remove unused, divide  in hook
 @todo можливо прибрати uniqueId і використовувати тільки той orderId всюди?
 думаю чому б ні???
 лише для редагування можна передавати рідний id, наприклад, і то хз
 зробити _id або uniqueId, а той шо order — або orderId або просто id
 */
const MessagesListImpl: FC<OwnProps & StateProps> = ({
  messageIds,
  messagesById,
  chatId,
  // isMessagesLoading,
  chat,
  isSavedMessages,
  isChannel,
  isGroup,
  isPrivateChat,
  isPinnedList,
  hasMessageSelection,
  language,
  infiniteScrollRef,
}) => {
  const {getHistory, readHistory, getPinnedMessages} = getActions()

  const isReady = useRef(false)
  const isFirstRender = useRef(true)
  const isFetching = useRef(false)
  // const [shifting, setShifting] = useState(false)
  const [startFetching, setStartFetching] = useState(false)
  const [endFetching, setEndFetching] = useState(false)
  const [firstUnreadMessage2, setFirstUnreadMessage2] = useState(
    messagesById && chat?.lastReadIncomingMessageId !== undefined
      ? getFirstUnreadMessage({messagesById, lastRead: chat?.lastReadIncomingMessageId})
      : undefined
  )
  useEffect(() => {
    ;(async () => {
      if (isPinnedList) {
        await getPinnedMessages({chatId})
      } else {
        await handleFetchHistory2({
          chatId,
          offsetId: chat?.unreadCount ? chat?.lastReadIncomingMessageId : undefined,
          direction: chat?.unreadCount ? HistoryDirection.Around : HistoryDirection.Backwards,
          includeOffset: true,
          limit: 40,
        })
        if (chat?.unreadCount) {
          console.log(chat?.lastReadIncomingMessageId, 'SHOULD FETCH AROUND FROM')
        }
      }

      isReady.current = true
      // handleScroll()
    })()

    // getHistory({
    //   chatId,
    //   limit: 100,
    // })
  }, [chatId, isPinnedList])

  useLayoutEffect(() => {
    if (!infiniteScrollRef.current || !messageIds || !messagesById || !chat) {
      return
    }

    // if (isFirstRender.current) {
    //   infiniteScrollRef.current.scrollToIndex(messageIds.length - 1)
    // }
    console.error(
      'IS FIRST RENDER:',
      isFirstRender.current,
      'IS FETCHING:',
      isFetching.current
    )
    if (
      isFirstRender.current &&
      chat.lastReadIncomingMessageId !== undefined /* &&
      chat.unreadCount */
    ) {
      const test = getFirstUnreadMessage({
        messagesById,
        lastRead: chat.lastReadIncomingMessageId,
      })
      if (test) {
        setFirstUnreadMessage2(test)
        const index = messageIds.findIndex((id) => test?.id === id)

        logger.info('SCROLL TO FIRST UNREAD MESSAGE', test, index)

        infiniteScrollRef.current.scrollToIndex(index, {align: 'start'})
      } else {
        logger.info('SCROLL TO BOTTOM')
        infiniteScrollRef.current.scrollToIndex(messageIds.length)
      }
    } else if (!isFetching.current) {
      logger.info('SCROLL TO BOTTOM')
      infiniteScrollRef.current.scrollToIndex(messageIds.length)
    }
    // isReady.current = true

    isFirstRender.current = false
  }, [chatId, messageIds, messagesById])

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

    return groups.filter((group) => group.ids.length > 0)
  }, [messageIds, chatId])

  const count = messageIds?.length || 0
  const startFetchedCountRef = useRef(-1)
  const endFetchedCountRef = useRef(-1)
  const emptyList = count === 0

  const shouldRenderNoMessage =
    messageIds?.length === 0 ||
    (messageIds?.length === 1 && chat?.lastMessage?.action?.type === 'chatCreate')
  const [isScrolledDown, setIsScrolledDown] = useState(false)
  const buildedClass = clsx('messages-list', {
    'is-selecting': hasMessageSelection,
    'is-pinned': isPinnedList,
    'is-scrolled-down': isScrolledDown,
    'is-empty': emptyList || !messageIds,
  })

  // const firstUnreadMessage = useMemo(() => {
  //   if (!messagesById || chat?.lastReadIncomingMessageId === undefined) {
  //     return
  //   }
  //   return getFirstUnreadMessage({
  //     messagesById,
  //     lastRead: chat!.lastReadIncomingMessageId,
  //   })
  // }, [])

  const renderedItems = useMemo(() => {
    return dateGroup
      .map((group) => {
        const groupDate = formatMessageGroupDate(new Date(group.date), language)
        const test = (
          <div class="bubble action is-date">
            <div class="bubble-content">{groupDate}</div>
          </div>
        )
        const items = group.ids.map((id, idx) => {
          const message = messagesById?.[id]
          const nextMessage = messagesById?.[group.ids[idx + 1]]
          const prevMessage = messagesById?.[group.ids[idx - 1]]

          const isLastInGroup =
            (!message?.deleteLocal && nextMessage?.senderId !== message?.senderId) ||
            Boolean(nextMessage?.deleteLocal) /* @todo add group by date ~10min difference */
          const isFirstInGroup = prevMessage?.senderId !== message?.senderId
          const isLastInList = idx === group.ids.length - 1
          const withAvatar = !message?.isOutgoing
          return (
            message && (
              <MessageBubble
                key={id}
                isFirstUnread={firstUnreadMessage2?.id === id}
                isLastInList={isLastInList}
                isFirstInGroup={isFirstInGroup}
                isLastInGroup={isLastInGroup}
                withAvatar={withAvatar}
                message={message}
              />
            )
          )
        })
        return [test, ...items]
      })
      .flat()
  }, [dateGroup, firstUnreadMessage2])

  /**
   * @todo fix: sending status messages ( 155 line on MessageBuble.tsx ) +
   *
   * @todo continue infinite scrolling ( 246 line ) +
   *
   *
   * @todo спочатку треба getHistory({offsetId: firstUnreadMessage.orderedId ...?, Around ?}) for Around required offsetId +
   */
  const handleFetchHistory2 = async (payload: GetHistoryPayload, isStart = false) => {
    isFetching.current = true
    const setFetching = isStart ? setStartFetching : setEndFetching
    setFetching(true)
    // setShifting(isStart)

    await getHistory(payload)

    setFetching(false)
    isFetching.current = false
  }
  const handleRangeChange = async (start: number, end: number) => {
    if (
      !isReady.current ||
      !messageIds?.length ||
      !infiniteScrollRef.current ||
      isFetching.current
    ) {
      return
    }

    if (end + THRESHOLD > count && endFetchedCountRef.current < count) {
      endFetchedCountRef.current = count

      void debounceGetHistory(() => {
        const offsetId = messagesById?.[messageIds[messageIds.length - 1]]?.orderedId
        if (offsetId === chat?.lastMessage?.orderedId) {
          return
        }
        handleFetchHistory2({
          chatId,
          limit: GET_HISTORY_LIMIT,
          offsetId,
          direction: HistoryDirection.Forwards,
        })
        console.log('SHOULD LOAD IN BOTTOM', {offsetId})
      })
    } else if (start - THRESHOLD < 0 && startFetchedCountRef.current < count) {
      startFetchedCountRef.current = count

      void debounceGetHistory(() => {
        const offsetId = messagesById?.[messageIds[0]]?.orderedId

        if (offsetId === 0) {
          return
        }

        handleFetchHistory2(
          {
            chatId,
            limit: GET_HISTORY_LIMIT,
            offsetId,
            direction: HistoryDirection.Backwards,
          },
          true
        )
        console.log('SHOULD LOAD IN TOP', {offsetId})
      })
    }

    // -----
    let newLastReadIncoming

    for (let i = end - 1; i >= start; i--) {
      const message = messagesById?.[messageIds[i]]

      if (message && !message.isOutgoing) {
        newLastReadIncoming = message
        break // Зупиняємо пошук, якщо знайдено крайнє повідомлення
      }
    }
    if (!newLastReadIncoming) {
      return
    }

    if (chat!.lastReadIncomingMessageId! < newLastReadIncoming.orderedId) {
      logger.warn('SHOULD MARK AS LAST READ:', newLastReadIncoming.orderedId)
      readHistory({chatId, maxId: newLastReadIncoming.orderedId})
    }
    // -----
    // })
  }

  const handleScroll = useCallback(() => {
    startTransition(() => {
      if (!infiniteScrollRef.current || !isReady.current) {
        return
      }

      setIsScrolledDown(
        infiniteScrollRef.current.scrollOffset -
          infiniteScrollRef.current.scrollSize +
          infiniteScrollRef.current.viewportSize >=
          -1.5
      )
    })
  }, [])
  return (
    <div class={buildedClass}>
      <Loader isVisible={!messageIds} isLoading />
      <div style={{zIndex: 999, position: 'absolute'}}>
        <h4>LAST READ BY ME: {chat?.lastReadIncomingMessageId}</h4>
        <h4>LAST READ BY OTHER: {chat?.lastReadOutgoingMessageId}</h4>
        <h1>UNREAD: {chat?.unreadCount}</h1>
      </div>
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

          {/* @ts-expect-error Preact types are confused */}
          <VList
            shift={isFetching.current}
            reverse
            ref={infiniteScrollRef}
            onScroll={handleScroll}
            onRangeChange={handleRangeChange}
            components={{Item: VirtualScrollItem}}
            className="scrollable scrollable-hidden"
            overscan={30}
            style={{
              flex: 1,
              paddingBlock: '5px',
              overflowX: 'hidden' /* overflowAnchor: 'none' */,
            }}
          >
            {startFetching && (
              <Loader
                size="small"
                styles={{marginTop: 10, position: 'relative', marginRight: 'calc(50% - 20px)'}}
                isVisible
                isLoading
              />
            )}

            {renderedItems}

            {endFetching && (
              <Loader
                size="small"
                styles={{marginTop: 10, position: 'relative', marginRight: 'calc(50% - 20px)'}}
                isVisible
                isLoading
              />
            )}
          </VList>
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
  const language = state.settings.language
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
    language,
  }
}

export const MessagesList = memo(connect(mapStateToProps)(MessagesListImpl))
