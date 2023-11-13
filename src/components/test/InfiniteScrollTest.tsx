import {type FC, useEffect, useLayoutEffect, useRef, useState} from 'preact/compat'

import {VList, type VListHandle} from 'virtua'

import {timeout} from 'utilities/schedulers/timeout'

import {VirtualScrollItem} from 'containers/middle/message/MessageBubble'

import {Spinner} from 'components/ui'

export const InfiniteScrollTest: FC = () => {
  const id = useRef(0)
  const createRows = (num: number) => {
    const heights = [20, 40, 80, 77]
    return Array.from({
      length: num,
    }).map(() => {
      const i = id.current++
      return (
        <div
          key={i}
          style={{
            height: heights[i % 4],
            borderBottom: 'solid 1px #ccc',
            background: '#fff',
          }}
        >
          {i}
        </div>
      )
    })
  }
  const [shifting, setShifting] = useState(false)
  const [startFetching, setStartFetching] = useState(false)
  const [endFetching, setEndFetching] = useState(false)
  const fetchItems = async (isStart = false) => {
    setShifting(isStart)
    const setFetching = isStart ? setStartFetching : setEndFetching
    setFetching(true)
    await timeout(1000)(1)
    setFetching(false)
  }
  const ref = useRef<VListHandle>(null)
  const ITEM_BATCH_COUNT = 100
  const [items, setItems] = useState(() => createRows(ITEM_BATCH_COUNT * 2))
  const THRESHOLD = 50
  const count = items.length
  const startFetchedCountRef = useRef(-1)
  const endFetchedCountRef = useRef(-1)
  const ready = useRef(false)
  useLayoutEffect(() => {
    ref.current?.scrollToIndex(items.length / 2 + 1)
    ready.current = true
  }, [])
  return (
    <VList
      ref={ref}
      style={{
        flex: 1,
      }}
      components={{
        Item: VirtualScrollItem,
      }}
      shift={shifting ? true : false}
      onRangeChange={async (start, end) => {
        if (!ready.current) return
        if (end + THRESHOLD > count && endFetchedCountRef.current < count) {
          endFetchedCountRef.current = count
          await fetchItems()
          setItems((prev) => [...prev, ...createRows(ITEM_BATCH_COUNT)])
        } else if (start - THRESHOLD < 0 && startFetchedCountRef.current < count) {
          startFetchedCountRef.current = count
          await fetchItems(true)
          setItems((prev) => [...createRows(ITEM_BATCH_COUNT).reverse(), ...prev])
        }
      }}
    >
      {startFetching && <Spinner key="head" color="white" />}
      {items}

      {endFetching && <Spinner key="foot" color="white" />}
    </VList>
  )
}
