import {useComputed, useSignal, useSignalEffect} from '@preact/signals'
import {
  type FC,
  type TargetedEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'preact/compat'

import {StoriesProvider} from 'context/stories'

import type {ApiStory} from 'api/types/stories'

import {useBoolean} from 'hooks/useFlag'
import {useIsMounted} from 'hooks/useIsMounted'

import {addEscapeListener} from 'utilities/keyboardListener'
import {stopEvent} from 'utilities/stopEvent'

import {Menu, MenuItem} from 'components/popups/menu'
import {SingleTransition} from 'components/transitions'
import {Icon, IconButton} from 'components/ui'
import {AvatarTest} from 'components/ui/AvatarTest'
import {DropdownMenu} from 'components/ui/DropdownMenu'
import {Portal} from 'components/ui/Portal'
import {TextArea} from 'components/ui/TextArea'

import {StoryLike} from './components/like'
import {StoryProgressList} from './components/progressList'
import {Story} from './story'

import './viewer.scss'

interface StoryViewerProps {
  isOpen: boolean
  onClose: VoidFunction
  currentIndex?: number
  stories: ApiStory[]
  onNext?: VoidFunction
  onPrev?: VoidFunction
  onAllStoriesEnd?: (idx: number) => void
}

/**
 * removed unused
 * https://github.com/mohitk05/react-insta-stories
 */
const StoryViewer: FC<StoryViewerProps> = ({
  currentIndex,
  stories,
  onNext,
  onPrev,
  onAllStoriesEnd,
  onClose,
  isOpen,
}) => {
  const [isPaused, setIsPaused] = useState(false)

  const [storyId, setStoryId] = useState(0)
  const isMounted = useIsMounted()

  const mousedownId = useRef<any>()

  useEffect(() => {
    if (typeof currentIndex === 'number') {
      if (currentIndex >= 0 && currentIndex < stories.length) {
        setStoryId(() => currentIndex)
      } else {
        console.error(
          'Index out of bounds. Current index was set to value more than the length of stories array.',
          currentIndex
        )
      }
    }
  }, [currentIndex])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'ArrowLeft':
        handlePrev()
        break
      case 'ArrowRight':
        handleNext()
        break
      case 'Space':
        if (!isFocused.value) {
          setIsPaused((prev) => !prev)
        }
        break
    }
  }

  function handleNextStoryId() {
    setStoryId((prev) => {
      if (prev < stories.length - 1) return prev + 1
      onAllStoriesEnd?.(storyId)
      return prev
    })
  }

  function handleNext() {
    /*    if (!isMounted()) { // ??
      return
    } */
    if (isPaused) {
      setIsPaused(false)
    }
    onNext?.()
    handleNextStoryId()
  }

  function handlePrev() {
    if (isPaused) {
      setIsPaused(false)
    }
    onPrev?.()
    setStoryId((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const debouncePause = (e: TargetedEvent<HTMLDivElement, MouseEvent | TouchEvent>) => {
    e.preventDefault()
    if (isFocused.value) {
      isFocused.value = false
      return
    }
    mousedownId.current = setTimeout(() => {
      // toggleState('pause')

      setIsPaused(true)
    }, 200)
  }

  const mouseUp =
    (type: 'next' | 'prev') => (e: TargetedEvent<HTMLDivElement, MouseEvent | TouchEvent>) => {
      e.preventDefault()
      if (isFocused.value) {
        isFocused.value = false
        return
      }
      mousedownId.current && clearTimeout(mousedownId.current)

      if (isPaused) {
        // setTimeout(() => {
        setIsPaused(false)
        // }, 200)
      } else {
        type === 'next' ? handleNext() : handlePrev()
      }
    }

  const storyRef = useRef<HTMLDivElement>(null)
  const handleBackdropClick = useCallback((e: TargetedEvent<HTMLDivElement, MouseEvent>) => {
    console.log(e.target as HTMLElement)

    /* AHHAHAHAHHA */
    /**
     * переробити просто рефи на кнопки повісити? contains робити так само
     */
    if (
      !storyRef.current?.contains(e.target as Node) &&
      (e.target as HTMLElement).className !== 'story-btn-container' &&
      (e.target as HTMLElement).className !== 'story-btn' &&
      (e.target as HTMLElement).tagName !== 'svg' &&
      (e.target as HTMLElement).tagName !== 'line' &&
      (e.target as HTMLElement).tagName !== 'polyline' &&
      (e.target as HTMLElement).tagName !== 'path'
    ) {
      onClose()
    }
  }, [])

  const html = useSignal('')
  const isFocused = useSignal(false)
  const inputRef = useRef<HTMLDivElement>(null)
  const handleChange = (v: string) => {
    html.value = v
  }

  function handleEscape() {
    if (isFocused.value) {
      isFocused.value = false
    } else {
      onClose()
    }
  }
  useEffect(() => {
    return () => (isOpen ? addEscapeListener(handleEscape) : undefined)
  }, [isOpen])

  useSignalEffect(() => {
    // console.log(isFocused.value, 'val')
    if (isFocused.value) {
      setIsPaused(true)
    }
  })
  function handleTogglePause() {
    setIsPaused((prev) => !prev)
  }
  // console.log(html.value.length)
  const isSendDisabled = useComputed(() => html.value.length === 0)
  const {value: isMenuOpen, setFalse: closeMenu, setTrue: openMenu} = useBoolean()

  return (
    <StoriesProvider
      value={{
        storyId,
        defaultDuration: 3000,
        isPaused,
        loop: false,
        onAllStoriesEnd,
        onNext,
        onPrev,
        onStoryEnd(index, story) {
          // eslint-disable-next-line no-console
          console.log(`STORY ${index} ENDED`, story)
        },
        onStoryStart(index, story) {
          // eslint-disable-next-line no-console
          console.log(`STORY ${index} STARTED`, story)
        },
        stories,
        handleNext,
        handlePrev,
      }}
    >
      <Portal>
        <SingleTransition
          onClick={handleBackdropClick}
          className="stories-viewer-backdrop"
          name="fade"
          appear
          unmount
          timeout={200}
          in={isOpen}
        >
          <div class="story-btn-container">
            <Icon color="white" className="story-btn story-btn-prev" name="arrowLeft" />
          </div>
          <IconButton className="stories-viewer-close" icon="close" onClick={onClose} />
          <div
            class={`stories-viewer-container${isFocused.value ? ' input-focused' : ''}`}
            ref={storyRef}
          >
            <div class="stories-viewer">
              <StoryProgressList />
              <div class="stories-header">
                <div class="author-info">
                  <AvatarTest size="xs" />
                  <div class="author-text">
                    <p class="author-name">Me</p>
                    <p class="author-date">date</p>
                  </div>
                </div>
                <div class="stories-header__btns">
                  {/* <StoryLike isLiked={value} onToggle={toggle} /> */}

                  <IconButton
                    onClick={() => {
                      setIsPaused((prev) => !prev)
                    }}
                    icon={isPaused ? 'play' : 'pause'}
                    iconColor="white"
                  />
                  <IconButton
                    onClick={() => {
                      openMenu()
                      setIsPaused(true)
                    }}
                    icon="moreRounded"
                    iconColor="white"
                  />
                  <Menu
                    className="story-menu"
                    autoClose
                    isOpen={isMenuOpen}
                    onClose={closeMenu}
                    transform="top right"
                    withMount={false}
                    withPortal={false}
                    placement={{top: true, right: true}}
                  >
                    <MenuItem icon="forward" title="Share" />
                    <MenuItem icon="archived" title="Hide stories" />
                  </Menu>
                  <IconButton className="btn-close" icon="close" iconColor="white" />
                </div>
              </div>
              {html}
              <Story story={stories[storyId]} />
              <div class="stories-viewer-overlay">
                <div
                  style={{width: '50%', zIndex: 2}}
                  onTouchStart={debouncePause}
                  onTouchEnd={mouseUp('prev')}
                  onMouseDown={debouncePause}
                  onMouseUp={mouseUp('prev')}
                />
                <div
                  style={{width: '50%', zIndex: 2}}
                  onTouchStart={debouncePause}
                  onTouchEnd={mouseUp('next')}
                  onMouseDown={debouncePause}
                  onMouseUp={mouseUp('next')}
                />
              </div>
            </div>
            <div class={`input-story-test${isFocused.value ? ' focused' : ''}`}>
              <IconButton icon="attach" iconColor="secondary" />
              <TextArea
                wrapperClassName={isFocused.value ? 'focused' : undefined}
                tabIndex={0}
                autoFocus={false}
                placeholder="Відповісти в особисті..."
                className="story-input"
                isFocused={isFocused}
                html={html}
                inputRef={inputRef}
                onChange={handleChange}
              />
              <IconButton icon="reactions" iconColor="secondary" />
              <IconButton isDisabled={isSendDisabled} icon="send2" iconColor="primary" />
              {/* {isFocused.value ? 'FOCUS' : 'NO FOCUs'} */}
            </div>
            {isFocused.value && (
              <div
                class="input-backdrop"
                onMouseDown={(e) => {
                  stopEvent(e)
                  isFocused.value = false
                }}
                onMouseUp={(e) => {
                  stopEvent(e)
                }}
              />
            )}

            {/* TransitionGroup here */}
          </div>
          <div class="story-btn-container">
            <Icon color="white" className="story-btn story-btn-next" name="arrowRight" />
          </div>
        </SingleTransition>
      </Portal>
    </StoriesProvider>
  )
}

export {StoryViewer}
