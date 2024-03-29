import {
  type FC,
  type TargetedEvent,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/compat'

import clsx from 'clsx'

// import SmoothScroll from 'smooth-scroll'
import {type MapState, connect} from 'state/connect'

import {useClickAway} from 'hooks/useClickAway'
import {useBoolean} from 'hooks/useFlag'
import {useIntersectionObserver} from 'hooks/useIntersectionObserver'
import {useLayout} from 'hooks/useLayout'

import {type EmojiData, type EmojiItem, type EmojiSkin} from 'utilities/emoji'
import {retryFetch} from 'utilities/fetch'
import {addEscapeListener} from 'utilities/keyboardListener'

import {ScreenLoader} from 'components/ScreenLoader'
import {Menu, MenuItem} from 'components/popups/menu'
import {SingleTransition} from 'components/transitions'
import {IconButton, type IconName} from 'components/ui'
import {Portal} from 'components/ui/Portal'

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
  )
  // await Promise.all(
  //   Object.values(data.emojis).map(async (e) => {
  //     await preloadImage(`emoji/${e.skins[emojiSkin].unified}.png`)
  //   })
  // )

  return data
}

const emojiIntersections: boolean[] = []

export interface EmojiPickerProps {
  isOpen: boolean
  onSelectEmoji: (e: EmojiItem) => void
  onChangeSkin: (skin: EmojiSkin) => void
  onClose: VoidFunction
}
interface StateProps {
  recentEmojis: string[]
  skinEmoji: EmojiSkin
}
const EmojiPickerImpl: FC<EmojiPickerProps & StateProps> = ({
  recentEmojis,
  isOpen,
  skinEmoji,
  onSelectEmoji,
  onChangeSkin,
  onClose,
}) => {
  const {isSmall, isAnimationOff} = useLayout()

  const [emojiData, setEmojiData] = useState<EmojiData | null>(null)
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0)
  const headerRef = useRef<HTMLDivElement>(null)
  const emojiContainerRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)
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
  }, [isOpen, skinEmoji])

  useEffect(() => {
    if (isSmall) {
      document.body.classList.toggle('emoji-menu-open', isOpen)
    }
  }, [isOpen, isSmall])

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

  function handleEmojiClick(emoji: EmojiItem) {
    // eslint-disable-next-line no-console
    onSelectEmoji(emoji)
  }

  const {observe} = useIntersectionObserver(
    {
      rootRef: emojiContainerRef,
      throttleMs: 250,
      isDisabled: !isOpen,
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
        // console.log({minIndex})

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
    'mobile-menu': isSmall,
  })

  const {value: isSkinMenuOpen, setFalse: closeSkinMenu, setTrue: openSkinMenu} = useBoolean()

  useClickAway(
    emojiPickerRef,
    (e, clicked) => {
      if (isOpen && !isSmall && clicked.className !== 'backdrop') {
        e.preventDefault()
        // e.stopImmediatePropagation()
        // stopEvent(e)
        onClose()
      }
    },
    !isOpen
  )

  useEffect(() => {
    return isOpen
      ? addEscapeListener(() => {
          onClose()
        })
      : undefined
  }, [isOpen])

  const skinItems = useMemo(() => {
    /**
     * @todo i18n
     */
    return ['Default', 'Light', 'Medium-Light', 'Medium', 'Medium-Dark', 'Dark']
  }, [])
  const picker = (
    <SingleTransition
      timeout={isSmall ? undefined : 150}
      appear
      styles={{transformOrigin: 'left bottom'}}
      in={isOpen}
      name={isSmall ? 'slideY' : isAnimationOff ? 'fade' : 'zoomFade'}
      toggle
      unmount
      className={buildedClass}
      elRef={emojiPickerRef}
      onExited={() => {
        setActiveCategoryIndex(0)
      }}
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
                skinEmoji={skinEmoji}
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
      <div class="emoji-footer">
        <span class="skin-tone" onClick={openSkinMenu} />

        <Menu
          withBackdrop
          withMount
          className="skin-tone-menu"
          onClose={closeSkinMenu}
          isOpen={isSkinMenuOpen}
          transform="bottom right"
          placement={{
            right: true,
            bottom: true,
          }}
          // timeout={300}
        >
          {skinItems.map((label, i) => (
            <MenuItem key={i}>
              <span class={`skin-tone skin-tone-${i}`} />
              {label}
            </MenuItem>
          ))}
        </Menu>
      </div>
    </SingleTransition>
  )
  return isSmall ? <Portal>{picker}</Portal> : picker
}

const mapStateToProps: MapState<EmojiPickerProps, StateProps> = (state) => {
  return {
    recentEmojis: state.emojis.recent,
    skinEmoji: 4,
  }
}

export default memo(connect(mapStateToProps)(EmojiPickerImpl))
