import {
  type FC,
  type TargetedEvent,
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/compat'

import clsx from 'clsx'

// import SmoothScroll from 'smooth-scroll'
import {type MapState, connect} from 'state/connect'

import {useBoolean} from 'hooks/useFlag'
import {useIntersectionObserver} from 'hooks/useIntersectionObserver'

import {type EmojiData} from 'utilities/emoji'
import {retryFetch} from 'utilities/fetch'
import {timeout} from 'utilities/schedulers/timeout'

import {ScreenLoader} from 'components/ScreenLoader'
import {SingleTransition} from 'components/transitions'
import {IconButton, type IconName} from 'components/ui'

import {EmojiCategory} from './EmojiCategory'

import './EmojiPicker.scss'

/**
 * @todo - EmojiTooltip коли вводимо текст в інпуті, потрібно шукати
 */
const categoriesIcons: Record<string, IconName> = {
  recent: 'recent',
  people: 'smile',
  nature: 'animals',
  foods: 'eats',
  activity: 'sport',
  places: 'car',
  objects: 'lamp',
  symbols: 'language',
  flags: 'flag',
}

async function initData(): Promise<EmojiData> {
  const data = await retryFetch<EmojiData>(
    'https://cdn.jsdelivr.net/npm/@emoji-mart/data@latest/sets/14/apple.json',
    false
  ).then(timeout(5000))

  return data
}

const emojiIntersections: boolean[] = []

export interface EmojiPickerProps {
  isOpen: boolean
}
interface StateProps {
  recentEmojis: string[]
}
const EmojiPickerImpl: FC<EmojiPickerProps & StateProps> = ({recentEmojis, isOpen}) => {
  const [emojiData, setEmojiData] = useState<EmojiData | null>(null)
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0)
  const headerRef = useRef<HTMLDivElement>(null)
  const emojiContainerRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  const shouldLoading = !emojiData

  useLayoutEffect(() => {
    if (!isOpen || !headerRef.current || !barRef.current) {
      return
    }
    const tab = document.getElementById(`emoji_${activeCategoryIndex}`)
    if (!tab) {
      return
    }
    const linePosition = tab.offsetLeft
    const isNotFullyVisible = headerRef.current.offsetWidth < headerRef.current.scrollWidth

    const scrollOffset = headerRef.current.offsetWidth / Object.keys(categoriesIcons).length

    const isNotFullyVisibleScrollLeft = Math.max(linePosition - scrollOffset, 0)

    headerRef.current.scrollTo({
      left: isNotFullyVisible ? isNotFullyVisibleScrollLeft : linePosition,
      behavior: 'smooth',
    })

    const {width: tabWidth, left: tabLeft} = tab.getBoundingClientRect()
    const {left: containerLeft} = headerRef.current.getBoundingClientRect()
    // console.log({tabLeft: tab.offsetLeft})
    const leftPosition = !isNotFullyVisible
      ? linePosition
      : tabLeft - containerLeft + headerRef.current.scrollLeft

    barRef.current.style.transform = `translateX(${leftPosition}px)`
    barRef.current.style.width = `${tabWidth}px`
  }, [isOpen, activeCategoryIndex])
  useEffect(() => {
    if (isOpen && !emojiData) {
      ;(async () => {
        const data = await initData()
        setEmojiData(data)
      })()
    }
  }, [isOpen])

  const changeCategory = (idx: number, e: TargetedEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    const categoryEl = document.getElementById(`emoji-category-${idx}`)
    if (!categoryEl) {
      return
    }
    // need to add 5 for padding.
    // console.log(categoryEl.off)
    const topOffset =
      categoryEl?.offsetTop !== undefined ? categoryEl.offsetTop + 5 : undefined
    emojiContainerRef.current?.scrollTo({
      // behavior: 'smooth',
      top: topOffset,
    })
    setActiveCategoryIndex(idx)
  }

  function handleEmojiClick(emojiId: string) {
    // eslint-disable-next-line no-console
    console.log('CLICKED:', emojiData?.emojis[emojiId])
  }

  const {observe} = useIntersectionObserver(
    {
      rootRef: emojiContainerRef,
      throttleMs: 200,
    },
    (entries) => {
      entries.forEach((entry) => {
        const {id} = entry.target as HTMLDivElement
        if (!id || !id.startsWith('emoji-category-')) {
          return
        }
        const newIdx = +id.split('emoji-category-')[1]

        emojiIntersections[newIdx] = entry.isIntersecting

        const minIndex = emojiIntersections.findIndex((isIntersecting) => isIntersecting)

        setActiveCategoryIndex(minIndex)
      })
    }
  )

  const allCategories = useMemo(() => {
    if (!emojiData?.categories) {
      return []
    }
    const copiedCategories = [...emojiData.categories]
    copiedCategories.unshift({
      id: 'recent',
      emojis: recentEmojis,
    })

    return copiedCategories
  }, [emojiData, recentEmojis])

  const {value, toggle: toggleSearch} = useBoolean(false)

  const buildedClass = clsx('emoji-picker', {
    'search-active': value,
  })

  return (
    <div class="just-test-container">
      {/* <IconButton icon="smile" onClick={toggle} /> */}
      <SingleTransition
        appear
        styles={{transformOrigin: 'left bottom'}}
        in={isOpen}
        name="zoomFade"
        toggle
        className={buildedClass}
      >
        <div class="emoji-header">
          <IconButton className="search-btn" icon="search" onClick={toggleSearch} />
          {/* @todo винести окремо Input з анімацією placeholder`a, і т.д */}
          <input placeholder="Search" class="search-input" />
          <div
            class="emoji-header-container scrollable scrollable-x scrollable-hidden"
            ref={headerRef}
          >
            {Object.keys(categoriesIcons).map((i, idx) => (
              <IconButton
                id={`emoji_${idx}`}
                onClick={(e) => changeCategory(idx, e)}
                className="category-btn"
                key={i}
                icon={categoriesIcons[i]}
                title={i}
              />
            ))}
            <div ref={barRef} class="emoji-header__line" />
          </div>
        </div>
        <div class="emoji-content">
          <div ref={emojiContainerRef} class="scrollable scrollable-y">
            {shouldLoading ? (
              <ScreenLoader size="medium" withBg={false} />
            ) : (
              allCategories.map((c, idx) => (
                <EmojiCategory
                  key={c.id}
                  category={c}
                  emojiData={emojiData}
                  idx={idx}
                  intersectionObserve={observe}
                  onSelectEmoji={handleEmojiClick}
                  shouldRender={
                    idx === activeCategoryIndex ||
                    idx === activeCategoryIndex - 1 ||
                    idx === activeCategoryIndex + 1
                  }
                />
              ))
            )}
          </div>
        </div>
      </SingleTransition>
    </div>
  )
}

const mapStateToProps: MapState<EmojiPickerProps, StateProps> = (state) => {
  return {
    recentEmojis: state.recentEmojis,
  }
}

export default memo(connect(mapStateToProps)(EmojiPickerImpl))
