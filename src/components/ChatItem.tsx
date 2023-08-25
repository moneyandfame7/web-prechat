import type {Signal} from '@preact/signals'
import {type FC, useEffect} from 'preact/compat'

import clsx from 'clsx'

import type {ApiUser} from 'api/types/users'

import {getActions} from 'state/action'
import {getGlobalState} from 'state/signal'

import {Ripple} from './Ripple'
import {AvatarTest} from './ui/AvatarTest'
import {Checkbox} from './ui/Checkbox'

import './ChatItem.scss'

interface ContextAction {
  icon: string
  title: string
  autoClose: boolean
  handler: VoidFunction
}
export interface ChatItemProps {
  withCheckbox?: boolean
  hover?: boolean
  user?: ApiUser
  contextActions?: ContextAction[]
  onClick?: VoidFunction
  checked?: boolean | Signal<boolean>
  title?: string
  subtitle?: string
  userId: string
}

export const ListItem: FC<ChatItemProps> = ({
  withCheckbox,
  // hover,
  // contextActions,
  onClick,
  checked,
  title,
  subtitle,
  userId,
}) => {
  const {getUser} = getActions()
  const {users} = getGlobalState()
  useEffect(() => {
    if (!users.byId[userId]) {
      getUser(userId)
    }
  }, [])

  const buildedClass = clsx('ChatItem', {
    'non-clickable': !onClick,
  })

  const handleClick = (e: MouseEvent) => {
    e.preventDefault()
    if (e.button === 0) {
      onClick?.()
    }
  }
  return (
    <div class={buildedClass} onMouseDown={handleClick}>
      {withCheckbox && <Checkbox withRipple={false} checked={checked} />}

      {onClick && <Ripple />}
      <AvatarTest
        fullName={title}
        size="m"
        variant={users.byId[userId].fullInfo?.avatar.avatarVariant}
      />
      {/* {<Avatar user={user || users.byId[userId]} />} */}
      <div class="info">
        {title && <h3 class="title">{title}</h3>}
        {subtitle && <p class="subtitle">{subtitle}</p>}
      </div>
    </div>
  )
}
