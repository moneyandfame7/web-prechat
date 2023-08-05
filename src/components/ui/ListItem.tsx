import type {VNode} from 'preact'
import {type FC} from 'preact/compat'

import {Ripple} from 'components/Ripple'
import type {IconName} from './Icon'

import './ListItem.scss'

export interface MenuContextActions {
  title: string
  icon: IconName
  handler: VoidFunction
}
interface ListItemProps {
  withRipple?: boolean
  contextActions?: MenuContextActions
  children: VNode
  onClick: VoidFunction
}

export const ListItem: FC<ListItemProps> = ({withRipple, children, onClick}) => {
  return (
    <div class="ListItem" onMouseDown={onClick}>
      {children}
      {withRipple && <Ripple />}
    </div>
  )
}
