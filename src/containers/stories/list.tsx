import {type FC} from 'preact/compat'

import clsx from 'clsx'

import {useBoolean} from 'hooks/useFlag'

import {Icon} from 'components/ui'

import './list.scss'

const StoriesList: FC = () => {
  const {value, toggle} = useBoolean()

  const buildedClass = clsx('stories-avatar-wrapper', {
    'is-viewed': false,
    'is-loading': value,
  })

  return (
    <div class="stories-list">
      <div class={buildedClass} onClick={toggle}>
        <div class="stories-avatar-inner">
          <div class="stories-avatar-inner-inner">LR</div>
        </div>
        <span class="stories-add-story-badge">
          <Icon name="plus" />
        </span>
      </div>
      <div class="stories-avatar-wrapper is-loading">
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
      </div>
    </div>
  )
}

export {StoriesList}
