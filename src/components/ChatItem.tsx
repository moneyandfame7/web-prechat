import type {FC} from 'preact/compat'
import type {Signal} from '@preact/signals'

import {Checkbox} from './ui'

import {Ripple} from './Ripple'
import {Avatar} from './Avatar'
import './ChatItem.scss'

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
  onClick: VoidFunction
  checked?: boolean | Signal<boolean>
  title?: string
  subtitle?: string
}
// type TestProps =
//   | {
//       withCheckbox: boolean
//       avatar?: string
//       hover?: boolean
//       contextActions?: never
//       onToggle: (c: boolean) => void
//       checked: boolean
//     }
//   | {
//       withCheckbox?: never
//       avatar?: string
//       hover?: boolean
//       contextActions?: ContextAction[]
//       onToggle?: never
//       checked?: never
//     }
export const ChatItem: FC<ChatItemProps> = ({
  withCheckbox,
  avatar,
  hover,
  contextActions,
  onClick,
  checked,
  title,
  subtitle
}) => {
  return (
    <div class="ChatItem" onMouseDown={onClick}>
      {withCheckbox && <Checkbox withRipple={false} checked={checked}></Checkbox>}
      <Ripple />
      {avatar && <Avatar url={avatar} />}
      <div class="info">
        {title && <h3 class="title">{title}</h3>}
        {subtitle && <p class="subtitle">{subtitle}</p>}
      </div>
    </div>
  )
}
