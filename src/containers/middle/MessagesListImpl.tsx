import {type FC, useEffect, useLayoutEffect, useMemo, useRef} from 'preact/compat'

import clsx from 'clsx'
import {VList, VListHandle} from 'virtua'

import {getActions} from 'state/action'

import {SingleTransition} from 'components/transitions'
import {Loader} from 'components/ui/Loader'

import {MessageGroup, OwnProps, StateProps} from './MessagesList'
import {NoMessages} from './NoMessages'

/**
 * @todo views, sending status icon,
 * group by date + group by time
 */
export const MessagesListImpl: FC<OwnProps & StateProps> = ({
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
  language,
}) => {
  const {getHistory, getPinnedMessages} = getActions()
  const listRef = useRef<HTMLDivElement>(null)
  const infiniteScrollRef = useRef<VListHandle>(null)

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

    return groups.filter((group) => group.ids.length > 0)
  }, [messageIds, chatId])

  // const combined = useMemo(() => {
  //   console.time('COMBINED_DATE')
  //   const grouped: {date: string; ids: string[][]}[] = []
  //   dateGroup.forEach((group) => {
  //     const subgroups: string[][] = []
  //     let currentSubGroup: string[] = []
  //     let prevSenderId: string | null = null
  //     let prevTimestamp: number | null = null
  //     group.ids.forEach((id) => {
  //       const message = messagesById?.[id]
  //       /* idk how to handle message that can be undefined */
  //       if (message?.senderId && prevSenderId && prevSenderId !== message.senderId) {
  //         if (currentSubGroup.length) {
  //           subgroups.push(currentSubGroup)
  //         }
  //         currentSubGroup = []
  //       }
  //       const timestamp = getTimestamp(message)
  //       if (timestamp && (!prevTimestamp || timestamp - prevTimestamp > 10 * 60 * 1000)) {
  //         if (currentSubGroup.length) {
  //           subgroups.push(currentSubGroup)
  //         }
  //         currentSubGroup = []
  //       }
  //       currentSubGroup.push(id)
  //       prevSenderId = message?.senderId || null
  //       prevTimestamp = timestamp
  //     })
  //     if (currentSubGroup.length) {
  //       subgroups.push(currentSubGroup)
  //     }
  //     grouped.push({
  //       date: group.date,
  //       ids: subgroups,
  //     })
  //   })
  //   console.timeEnd('COMBINED_DATE')
  //   return grouped
  // }, [dateGroup])
  const emptyList = messageIds?.length === 0
  const shouldRenderNoMessage =
    messageIds?.length === 0 ||
    (messageIds?.length === 1 && chat?.lastMessage?.action?.type === 'chatCreate')

  const buildedClass = clsx('messages-list scrollable', {
    'is-selecting': hasMessageSelection,
    'is-pinned': isPinnedList,
  })

  return (
    <div class={buildedClass} ref={listRef}>
      <Loader isVisible={!messageIds} isLoading />
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
          <VList overscan={20} style={{height: '100%', flex: 1}}>
            {items.map((item) => (
              <div key={item}>{item}</div>
            ))}
          </VList>
          {/* @ts-expect-error Preact types are confused */}
          {/* <WVList
              // reverse
              // className="scrollable scrollable-hidden"
              overscan={1}
              style={{flex: 1, paddingBlock: '5px'}}
              // ref={infiniteScrollRef}
            >
              {dateGroup.map((group) => {
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
                    Boolean(nextMessage?.deleteLocal)
                  const isFirstInGroup = prevMessage?.senderId !== message?.senderId
                  const isLastInList = idx === group.ids.length - 1
                  const withAvatar = !message?.isOutgoing
                  return (
                    message && (
                      <MessageBubble
                        key={id}
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
              })}
            </WVList> */}
          {/* {combined.map((group) => {
              const groupDate = formatMessageGroupDate(new Date(group.date), language)
  
              return (
                <div key={`${groupDate}${chatId}`} class="message-date-group">
                  <div class="bubble action is-date">
                    <div class="bubble-content">{groupDate}</div>
                  </div>
                  {group.ids.map((groups, idx) => {
                    return <MessageBubblesGroup key={idx} chatId={chatId} groupIds={groups} />
                  })}
                </div>
              )
            })} */}
        </div>
      </SingleTransition>
    </div>
  )
}
