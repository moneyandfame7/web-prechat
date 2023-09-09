import type {ComponentChild, ComponentChildren} from 'preact'
import {type FC, memo} from 'preact/compat'

import clsx from 'clsx'

import {useFastClick} from 'hooks/useFastClick'

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
  to?: string
}

export const ListItem: FC<ListItemProps> = memo(
  ({
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
    to,
  }) => {
    const buildedClass = clsx('list-item', className, {
      clickable: withRipple || onClick,
      link: Boolean(to),
    })

    const hasInfo =
      Boolean(title) || Boolean(subtitle) || Boolean(additional) || Boolean(badge)

    const clickHandlers = useFastClick({fast: true, handler: onClick})
    function renderContainer(children: ComponentChildren) {
      if (to) {
        return (
          <a class={buildedClass} href={to} {...clickHandlers}>
            {children}
          </a>
        )
      }

      return (
        <div class={buildedClass} {...clickHandlers}>
          {children}
        </div>
      )
    }

    function renderContent() {
      return (
        <>
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
        </>
      )
    }

    return renderContainer(renderContent())
  }
)
