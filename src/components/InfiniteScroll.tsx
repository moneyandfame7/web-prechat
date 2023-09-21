import {type FC, forwardRef, useEffect, useLayoutEffect, useRef, useState} from 'preact/compat'

import {
  CustomViewportComponent,
  type CustomViewportComponentProps,
  VList,
  type VListHandle,
} from 'virtua'

import {timeout} from 'utilities/schedulers/timeout'

import {Loader} from './ui/Loader'

import './InfiniteScroll.scss'

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
const InfiniteScroll: FC = () => {
  // const [data,setData]
  // const listRef = useRef<VListHandle>(null)

  // useLayoutEffect(() => {
  //   if (!listRef.current) {
  //     return
  //   }
  //   listRef.current.scrollTo(listRef.current.scrollSize)
  // }, [])

  const createRows = (num: number, offset = 0) => {
    const heights = [20, 40, 80, 77]
    return Array.from({
      length: num,
    }).map((_, i) => {
      i += offset
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
  const [fetching, setFetching] = useState(false)
  const fetchItems = async () => {
    setFetching(true)
    await timeout(1000)('')
    setFetching(false)
  }
  const ITEM_BATCH_COUNT = 100
  const [items, setItems] = useState(() => createRows(ITEM_BATCH_COUNT))
  const fetchedCountRef = useRef(-1)
  const count = items.length

  useEffect(() => {
    console.log({fetching})
  }, [fetching])
  return (
    // @ts-expect-error Preact types are confused
    <VList
      overscan={20}
      style={
        {
          // flex: 1,
        }
      }
      components={{
        Root: InfiniteScrollContainer as CustomViewportComponent,
      }}
      onRangeChange={async (_, end) => {
        // trashhold?
        if (end + 50 > count && fetchedCountRef.current < count) {
          fetchedCountRef.current = count
          await fetchItems()
          setItems((prev) => [...prev, ...createRows(ITEM_BATCH_COUNT, prev.length)])
        }
      }}
    >
      {/* <Loader /> */}
      {/*  @ts-expect-error Preact types are confused */}
      {items}
      {/* {fetching && <Loader />} */}
    </VList>
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
