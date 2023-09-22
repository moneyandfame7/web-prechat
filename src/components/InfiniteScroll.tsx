import {useSignal} from '@preact/signals'
import {
  type FC,
  forwardRef,
  startTransition,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'preact/compat'

import {
  CustomViewportComponent,
  type CustomViewportComponentProps,
  VList,
  type VListHandle,
} from 'virtua'

import {timeout} from 'utilities/schedulers/timeout'

import {Button} from './ui'
import {Loader} from './ui/Loader'

import './InfiniteScroll.scss'

/* 
[12341234l1234123,34563456,123523452345]

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
  const id = useRef(0)
  const createRows = (num: number) => {
    // const heights = [20, 40, 80, 77]
    return Array.from({length: num}).map(() => Number(Math.random() * new Date().getTime()))
  }
  useEffect(() => {
    console.log(ref.current?.cache)
  }, [])
  const [shifting, setShifting] = useState(false)
  const [startFetching, setStartFetching] = useState(false)
  const [endFetching, setEndFetching] = useState(false)
  const fetchItems = async (isStart = false) => {
    setShifting(isStart)
    const setFetching = isStart ? setStartFetching : setEndFetching
    setFetching(true)
    await timeout(1000)('123123')
    setFetching(false)
  }
  const ref = useRef<VListHandle>(null)
  const ITEM_BATCH_COUNT = 100
  // const [items, setItems] = useState(() => createRows(ITEM_BATCH_COUNT * 2))

  const [items, setItems] = useState<string[]>(messageIds)
  const THRESHOLD = 1
  const count = items.length
  const startFetchedCountRef = useRef(-1)
  const endFetchedCountRef = useRef(-1)
  const ready = useRef(false)

  const shouldAnimate = useSignal(false)
  useEffect(() => {
    ref.current?.scrollToIndex(items.length / 2 + 1)
    ready.current = true
  }, [])
  return (
    /* @ts-expect-error preact types are confused */
    <div
      style={{
        border: '3px solid green',
        height: '50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Button
        fullWidth={false}
        onClick={() => {
          ref.current?.scrollToIndex(0, 'end')
        }}
      >
        Scroll to 0
      </Button>
      <Button
        fullWidth={false}
        onClick={() => {
          ref.current?.scrollToIndex(80, 'end')
          shouldAnimate.value = true
          setTimeout(() => {
            ref.current?.scrollToIndex(99, 'end')

            shouldAnimate.value = false
          }, 100)
        }}
      >
        Scroll to 99
      </Button>
      <VList
        ref={ref}
        style={{
          flex: 1,
          scrollBehavior: shouldAnimate.value ? 'smooth' : undefined,
        }}
        shift={shifting}
        onRangeChange={async (start, end) => {
          if (!ready.current) return
          // @todo threshhold не значить шо одразу з апішки, треба спочатку якось локально перевіряти?
          // або забити хуй і не паритись, бо це для мене ще дуже важко навчитись і кешувати і так далі. просто хуярити initial query і потім пагінацією.
          // але як придумати jumpToDate? не дарма ж я календар робив...
          startTransition(() => {
            console.error('ALL ITEMS: FIRST', items[0], 'LAST:', items[items.length - 1])
          })
          if (end + THRESHOLD > count && endFetchedCountRef.current < count) {
            console.log('SHOULD LOAD FOR BOTTOm', 'last cursor id:', items[end - 1])
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
        {items.map((val, idx) => (
          <div key={val} style={{backgroundColor: idx % 2 === 0 ? 'red' : 'green'}}>
            <h4>{val}</h4>
            <span>{idx}</span>
          </div>
        ))}
        <div style={endFetching ? undefined : {visibility: 'hidden', position: 'relative'}}>
          <Loader key="foot" isLoading isVisible />
        </div>
      </VList>
    </div>
  )
}

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
