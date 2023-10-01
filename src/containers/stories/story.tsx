import {type FC} from 'preact/compat'

import {useStories} from 'context/stories'

import type {ApiStory} from 'api/types/stories'

import {useBoolean} from 'hooks/useFlag'

import {StoryLike} from './components/like'

import './story.scss'

interface StoryProps {
  story: ApiStory
}
const Story: FC<StoryProps> = ({story}) => {
  const {isPaused} = useStories()
  return (
    <div class="story">
      {isPaused ? 'Pause' : ''}
      <br />
      <br />
      <br />
      <br />
      {/* {story.text} */}
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
