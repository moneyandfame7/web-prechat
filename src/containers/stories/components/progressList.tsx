import {type FC, useEffect, useLayoutEffect, useRef, useState} from 'preact/compat'

import clsx from 'clsx'
import {useStories} from 'context/stories'

import {StoryProgress} from './progress'

import './progress.scss'

function timestamp() {
  return window.performance && window.performance.now
    ? window.performance.now()
    : new Date().getTime()
}
const StoryProgressList: FC = () => {
  const [progress, setProgress] = useState<number>(0)
  const lastTime = useRef<number>()

  const {defaultDuration, onStoryEnd, onStoryStart, handleNext, stories, isPaused, storyId} =
    useStories()

  useLayoutEffect(() => {
    setProgress(0)
  }, [storyId, stories])

  useEffect(() => {
    if (!isPaused) {
      animationFrameId.current = requestAnimationFrame(animateProgress)
      lastTime.current = timestamp()
    }
    return () => {
      cancelAnimationFrame(animationFrameId.current)
    }
  }, [storyId, isPaused])

  const animationFrameId = useRef<number>()

  let progressCopy = progress

  function getStoryDuration() {
    return stories[storyId].duration || defaultDuration
  }
  function handleStart() {
    onStoryStart?.(storyId, stories[storyId])
  }

  function handleEnd() {
    onStoryEnd?.(storyId, stories[storyId])
  }
  const animateProgress = () => {
    if (progressCopy === 0) handleStart()
    if (lastTime.current == undefined) lastTime.current = timestamp()
    const t = timestamp()
    const dt = t - lastTime.current
    lastTime.current = t
    setProgress((count: number) => {
      const duration = getStoryDuration()
      progressCopy = count + (dt * 100) / duration
      return progressCopy
    })
    if (progressCopy < 100) {
      animationFrameId.current = requestAnimationFrame(animateProgress)
    } else {
      console.log({progressCopy}, 'ALLLLALLALAL')
      handleEnd()
      cancelAnimationFrame(animationFrameId.current)
      handleNext()
    }
  }

  const buildedClass = clsx('story-progress-list', {
    'is-hidden': isPaused,
  })

  return (
    <div class={buildedClass}>
      {stories.map((_, i) => {
        const type = getProgressType(i, storyId)
        return (
          // eslint-disable-next-line react/no-array-index-key
          <StoryProgress key={i} progress={progress} width={1 / stories.length} type={type} />
        )
      })}
    </div>
  )
}

export {StoryProgressList}

function getProgressType(i: number, currentIndex: number) {
  // eslint-disable-next-line no-nested-ternary
  return i === currentIndex ? 'active' : i < currentIndex ? 'prev' : 'next'
}
