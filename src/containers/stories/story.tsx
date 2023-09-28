import {type FC} from 'preact/compat'

import {useStories} from 'context/stories'

import type {ApiStory} from 'api/types/stories'

import './story.scss'

interface StoryProps {
  story: ApiStory
}
const Story: FC<StoryProps> = ({story}) => {
  const {isPaused} = useStories()
  return (
    <div class="story">
      {isPaused ? 'Pause' : ''}

      {story.text}
      {/* <div class="story-progress">
        <div class="progress-item-wrapper">
          <span class="progress-item" />
        </div>
        <div class="progress-item-wrapper">
          <span class="progress-item" />
        </div>
        <div class="progress-item-wrapper">
          <span class="progress-item" />
        </div>
        <div class="progress-item-wrapper">
          <span class="progress-item" />
        </div>
      </div> */}
    </div>
  )
}

export {Story}
