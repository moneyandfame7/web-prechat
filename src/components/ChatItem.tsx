import {useEffect, type FC} from 'preact/compat'
import type {Signal} from '@preact/signals'
import clsx from 'clsx'

import {Checkbox} from './ui'

import {Ripple} from './Ripple'
import {Avatar} from './Avatar'
import {getActions} from 'state/action'

import './ChatItem.scss'
import {getGlobalState} from 'state/signal'
import {deepClone} from 'utilities/deepClone'

interface ContextAction {
  icon: string
  title: string
  autoClose: boolean
  handler: VoidFunction
}
export interface ChatItemProps {
  withCheckbox?: boolean
  avatar?: string /* || ApiAvatar ??? */
  hover?: boolean
  contextActions?: ContextAction[]
  onClick?: VoidFunction
  checked?: boolean | Signal<boolean>
  title?: string
  subtitle?: string
  id: string
}

export const ChatItem: FC<ChatItemProps> = ({
  withCheckbox,
  avatar,
  // hover,
  // contextActions,
  onClick,
  checked,
  title,
  subtitle,
  id
}) => {
  const {getUser} = getActions()
  const {users} = getGlobalState()
  useEffect(() => {
    getUser(id)
  }, [])

  const buildedClass = clsx('ChatItem', {
    'non-clickable': !Boolean(onClick)
  })

  console.log(users)
  return (
    <div class={buildedClass} onMouseDown={onClick}>
      {withCheckbox && <Checkbox withRipple={false} checked={checked} />}

      {onClick && <Ripple />}
      {<Avatar user={users.byId[id]} avatar={users.byId[id].fullInfo?.avatar} />}
      <div class="info">
        {title && <h3 class="title">{title}</h3>}
        {subtitle && <p class="subtitle">{subtitle}</p>}
      </div>
    </div>
  )
}
