import type {ComponentChild} from 'preact'
import {type FC} from 'preact/compat'

import clsx from 'clsx'

import {IS_SENSOR} from 'common/config'

import {Ripple} from 'components/Ripple'

import {Icon, type IconName} from './Icon'

import './ListItem.scss'

export interface MenuContextActions {
  title: string
  icon: IconName
  handler: VoidFunction
}
interface ListItemProps {
  withRipple?: boolean
  contextActions?: MenuContextActions
  onClick?: VoidFunction
  icon?: IconName
  title?: string
  subtitle?: ComponentChild
  additional?: string
  className?: string
  badge?: string
  right?: string
}

export const ListItem: FC<ListItemProps> = ({
  icon,
  title,
  subtitle,
  withRipple = !IS_SENSOR,
  onClick,
  additional,
  className,
  badge,
  children,
  right,
}) => {
  const buildedClass = clsx('list-item', className, {
    clickable: withRipple || onClick,
  })

  const hasInfo = Boolean(title) || Boolean(subtitle) || Boolean(additional) || Boolean(badge)
  return (
    <div class={buildedClass} onMouseDown={onClick}>
      {icon && <Icon name={icon} />}
      {children}
      {hasInfo && (
        <>
          <div class="list-item__info">
            <div class="row row-title">
              {title && <p class="list-item__title">{title}</p>}
              {additional && <span class="list-item__additional">{additional}</span>}
            </div>
            <div class="row row-subtitle">
              {subtitle && <p class="list-item__subtitle">{subtitle}</p>}
              {badge && <p class="badge">{badge}</p>}
            </div>
          </div>
          {right && <div class="list-item__right">{right}</div>}
        </>
      )}

      {withRipple && <Ripple />}
    </div>
  )
}
;<div class="list-item__info">
  <div class="row row-title">
    <p class="list-item__title">Username</p>
    <p class="list-item__additional">12:35</p>
  </div>
  <div class="row row-subtitle">
    <p class="list-item__subtitle">
      <span class="primary-font">aboba: </span>
      Lorem ipsum dorem Lorem ipsum dorem Lorem ipsum dorem Lorem ipsum dorem Lorem ipsum dorem
      Lorem ipsum dorem Lorem ipsum dorem
    </p>
    <p class="badge">15</p>
  </div>
</div>
