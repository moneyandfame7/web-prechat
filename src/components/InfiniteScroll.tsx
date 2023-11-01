import {useSignal} from '@preact/signals'
import {
  type FC,
  forwardRef,
  memo,
  startTransition,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/compat'

import {
  CustomViewportComponent,
  type CustomViewportComponentProps,
  VList,
  type VListHandle,
} from 'virtua'

import {getActions} from 'state/action'
import {selectChat} from 'state/selectors/chats'
import {selectMessage} from 'state/selectors/messages'
import {getGlobalState} from 'state/signal'

import {timeout} from 'utilities/schedulers/timeout'

import {VirtualScrollItem} from 'containers/middle/message/MessageBubble'

import {Button} from './ui'
import {Loader} from './ui/Loader'

import './InfiniteScroll.scss'

/* [12341234l1234123,34563456,123523452345]

const newIds = need to sort
можливо варто просто зробити айді через autoincrement?


*/
// const TEST_ARRAY = Array.from({length: 5000}).fill(Math.random() * new Date().getTime())
const InfiniteScrollContainer = forwardRef<HTMLDivElement, CustomViewportComponentProps>(
  ({attrs, height, children}, ref) => {
    return (
      <div ref={ref} {...(attrs as any)}>
        <ul style={{position: 'relative', height, margin: 0}}>{children}</ul>
      </div>
    )
  }
)

interface InfiniteScrollProps {
  messageIds: string[]
}
const InfiniteScroll: FC<InfiniteScrollProps> = ({messageIds}) => {
  // useEffect(() => {
  //   console.log(ref.current?.cache)
  // }, [])
  const [shifting, setShifting] = useState(false)
  const fetchItems = async (isStart = false) => {
    setShifting(isStart)
    await timeout(1000)('123123')
  }
  const ref = useRef<VListHandle>(null)

  const [items, setItems] = useState<string[]>(messageIds)

  useEffect(() => {
    setItems(messageIds)
  }, [messageIds])
  const THRESHOLD = 10
  const count = items.length
  const startFetchedCountRef = useRef(-1)
  const endFetchedCountRef = useRef(-1)
  const ready = useRef(false)

  useLayoutEffect(() => {
    // ref.current?.scrollToIndex(items.length)
    ready.current = true
  }, [items])
  const global = getGlobalState()
  const actions = getActions()
  const chat = selectChat(global, global.chats.ids[0])
  return (
    <div
      style={{
        border: '3px solid green',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <h4>LAST READ BY ME: {chat?.lastReadIncomingMessageId}</h4>
      <h4>LAST READ BY OTHER: {chat?.lastReadOutgoingMessageId}</h4>
      <Button
        fullWidth={false}
        onClick={() => {
          ref.current?.scrollToIndex(0, {
            align: 'end',
            smooth: true,
          })
        }}
      >
        Scroll to 0
      </Button>
      <Button
        fullWidth={false}
        onClick={() => {
          ref.current?.scrollToIndex(99, {
            align: 'end',
            smooth: true,
          })
        }}
      >
        Scroll to 99
      </Button>
      {/*  @ts-expect-error preact types are confused  */}
      <VList
        ref={ref}
        style={{
          flex: 1,
          // scrollBehavior: shouldAnimate.value ? 'smooth' : undefined,
        }}
        components={{Item: VirtualScrollItem}}
        shift={shifting}
        onRangeChange={async (start, end) => {
          if (!ready.current) return

          // @todo threshhold не значить шо одразу з апішки, треба спочатку якось локально перевіряти?
          // або забити хуй і не паритись, бо це для мене ще дуже важко навчитись і кешувати і так далі. просто хуярити initial query і потім пагінацією.
          // але як придумати jumpToDate? не дарма ж я календар робив...
          startTransition(() => {
            console.error(
              'ALL ITEMS: FIRST',
              items.indexOf(items[start]),
              'LAST:',
              items.indexOf(items[end])
            )
            const msg = selectMessage(global, global.chats.ids[0], items[end])
            if (
              msg &&
              chat &&
              !msg.isOutgoing &&
              msg.orderedId > chat.lastReadIncomingMessageId!
            ) {
              console.log('SHOULD MARK AS READ ', msg.orderedId)

              // actions.readHistory({chatId: global.chats.ids[0], maxId: msg.orderedId})
            }
          })
          if (end + THRESHOLD > count && endFetchedCountRef.current < count) {
            console.log('SHOULD LOAD FOR BOTTOm', 'last cursor id:', items[end])
            // endFetchedCountRef.current = count // think need change only after success operations?
            await fetchItems()
            // setItems((prev) => [...prev, ...createRows(20)])
          } else if (start - THRESHOLD < 0 && startFetchedCountRef.current < count) {
            console.log('SHOULD LOAD FOR TOP', 'last cursor id:', items[start])

            // startFetchedCountRef.current = count //think need change only after success operations?
            await fetchItems(true)
            // setItems((prev) => [...createRows(20).reverse(), ...prev])
          }
        }}
      >
        {/* <div style={startFetching ? undefined : {visibility: 'hidden', position: 'relative'}}>
        <Loader key="header" isLoading isVisible />
      </div> */}
        {items.map((val, idx) => {
          return <TestComponent key={val} msgId={val} idx={idx} />
        })}
      </VList>
    </div>
  )
}

const TestComponent: FC<{msgId: string; idx: number}> = memo((props) => {
  const global = getGlobalState()
  const message = useMemo(() => selectMessage(global, global.chats.ids[0], props.msgId), [])
  const chat = useMemo(() => selectChat(global, global.chats.ids[0]), [])

  console.log('ITEM RERENDER >>>')
  return (
    <div key={props.msgId} style={{backgroundColor: props.idx % 2 === 0 ? 'pink' : 'yellow'}}>
      <h4>{props.msgId}</h4>
      <span>{message?.orderedId}</span>
      {message?.text}
      {message && !message.isOutgoing && chat && (
        <b>{chat.lastReadIncomingMessageId! < message.orderedId ? 'UNREAD' : 'READ'}</b>
      )}
      {!message?.isOutgoing && '****************'}
    </div>
  )
})

export {InfiniteScroll}

// <VList ref={listRef} style={{height: '100vh'}} mode="reverse" overscan={10}>
// {/*  @ts-expect-error Preact types are confused */}
// {Array.from({length: 1000}).map((_, i) => (
//   <div
//     key={i}
//     style={{
//       height: Math.floor(Math.random() * 10) * 10 + 10,
//       borderBottom: 'solid 1px gray',
//       background: 'white',
//     }}
//   >
//     {i}
//   </div>
// ))}
// </VList>
