import {type FC} from 'preact/compat'

import {StoryItem} from './item'

import './list.scss'

const StoriesList: FC = () => {
  return (
    <div class="stories-list">
      <StoryItem />
      {/* <div class="stories-avatar-wrapper is-loading">
        <div class="stories-avatar-inner">
          <div class="stories-avatar-inner-inner">LR</div>
        </div>
      </div>
      <div class="stories-avatar-wrapper">
        <div class="stories-avatar-inner">
          <div class="stories-avatar-inner-inner">LR</div>
        </div>
      </div>
      <div class="stories-avatar-wrapper">
        <div class="stories-avatar-inner">
          <div class="stories-avatar-inner-inner">LR</div>
        </div>
      </div> */}
    </div>
  )
}

export {StoriesList}
