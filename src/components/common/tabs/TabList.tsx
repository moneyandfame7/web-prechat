import {type FC, RefObject, memo, useEffect, useLayoutEffect, useRef} from 'preact/compat'

import type {MenuContextActions} from 'components/ui/ListItem'

import {Tab} from './Tab'

import './TabList.scss'

export interface TabItem {
  index?: number
  title: string
  badgeCount?: number
  contextActions?: MenuContextActions[]
}
interface TabListProps {
  contextLimiterSelector?: string
  activeTab: number
  tabs: TabItem[]
  onChange: (index: number) => void
  tabListRef?: RefObject<HTMLDivElement>
}
const TabList: FC<TabListProps> = memo(
  ({tabs, activeTab, onChange, contextLimiterSelector, tabListRef: customTabListRef}) => {
    let tabListRef = useRef<HTMLDivElement>(null)
    const lineRef = useRef<HTMLDivElement>(null)
    if (customTabListRef) {
      tabListRef = customTabListRef
    }
    useLayoutEffect(() => {
      if (!tabListRef.current || !lineRef.current) {
        return
      }

      const tab = tabListRef.current.querySelector(
        `#tab-btn-${activeTab}`
      ) as HTMLElement | null

      if (!tab) {
        return
      }

      console.log('new tab:', tab)
      // tabListRef.current.scrollIntoView({
      //   block: 'start',
      //   behavior: 'smooth',
      // })
      const linePosition = tab.offsetLeft
      lineRef.current.style.transform = `translateX(${linePosition})`

      const isNotFullyVisible = tabListRef.current.offsetWidth < tabListRef.current.scrollWidth

      const scrollOffset = tabListRef.current.offsetWidth / tabs.length

      const isNotFullyVisibleScrollLeft = Math.max(linePosition - scrollOffset, 0)

      tabListRef.current.scrollTo({
        left: isNotFullyVisible ? isNotFullyVisibleScrollLeft : linePosition,
      })

      const {width: tabWidth, left: tabLeft} = tab.getBoundingClientRect()
      const {left: containerLeft} = tabListRef.current.getBoundingClientRect()
      const leftPosition = !isNotFullyVisible
        ? linePosition
        : tabLeft - containerLeft + tabListRef.current.scrollLeft

      lineRef.current.style.transform = `translateX(${leftPosition}px)`
      lineRef.current.style.width = `${tabWidth}px`
    }, [activeTab])

    return (
      <div ref={tabListRef} class="tab-list scrollable-x scrollable-hidden">
        {tabs?.map((t, i) => (
          <Tab
            contextLimiterSelector={contextLimiterSelector}
            title={t.title}
            index={i}
            onSelect={onChange}
            key={i}
            currentIndex={activeTab}
            contextActions={t.contextActions}
          />
        ))}
        <span ref={lineRef} class="tab-line" />
      </div>
    )
  }
)

export {TabList}
