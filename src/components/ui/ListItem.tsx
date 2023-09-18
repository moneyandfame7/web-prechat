import type {ComponentChild} from 'preact'
import {type FC, type TargetedEvent, memo, useCallback, useRef} from 'preact/compat'

import clsx from 'clsx'

import {useContextMenu} from 'hooks/useContextMenu'
import {useFastClick} from 'hooks/useFastClick'

import {IS_SENSOR} from 'common/environment'

import {Ripple} from 'components/Ripple'
import {Menu, MenuItem} from 'components/popups/menu'

import {Checkbox} from '.'
import {Icon, type IconName} from './Icon'

import './ListItem.scss'

export interface MenuContextActions {
  handler: VoidFunction
  title: string
  icon?: IconName
  danger?: boolean
}
interface ListItemProps {
  withRipple?: boolean
  withCheckbox?: boolean
  contextActions?: MenuContextActions
  onClick?: (e: TargetedEvent<HTMLDivElement, MouseEvent>) => void
  onToggleCheckbox?: (checked: boolean) => void
  icon?: IconName
  title?: ComponentChild
  subtitle?: ComponentChild
  additional?: ComponentChild
  className?: string
  badge?: ComponentChild
  right?: ComponentChild
  href?: string
  isChecked?: boolean
  withContextMenuPortal?: boolean
  onMouseDown?: (e: TargetedEvent<HTMLDivElement, MouseEvent>) => void
}

export const ListItem: FC<ListItemProps> = memo(
  ({
    icon,
    title,
    subtitle,
    withRipple = !IS_SENSOR,
    additional,
    className,
    badge,
    children,
    right,
    href,
    withCheckbox = false,
    isChecked = false,
    // contextActions,
    withContextMenuPortal = false,
    onClick,
    onToggleCheckbox,
    // onMouseDown,
  }) => {
    const menuRef = useRef<HTMLDivElement>(null)

    const getMenuElement = useCallback(() => {
      return (
        withContextMenuPortal ? document.querySelector('#portal') : containerRef.current
      )!.querySelector('.list-item__context-menu') as HTMLElement | null
    }, [withContextMenuPortal])

    const getLimiterElement = useCallback(() => {
      return containerRef.current?.parentElement as HTMLElement | null
    }, [])
    const containerRef = useRef<HTMLDivElement>(null)
    const {handleContextMenuClose, handleContextMenu, isContextMenuOpen, styles} =
      useContextMenu(
        menuRef,
        containerRef,
        getMenuElement,
        undefined,
        withContextMenuPortal,
        true
      )

    const ButtonElement = href ? 'a' : 'div'
    const buildedClass = clsx('list-item', className, {
      clickable: withRipple || onClick,
      link: Boolean(href),
      selectable: withCheckbox,
      focused: isContextMenuOpen,
    })

    const hasInfo =
      Boolean(title) || Boolean(subtitle) || Boolean(additional) || Boolean(badge)

    const clickHandlers = useFastClick(onClick, true)

    function renderContent() {
      return (
        <>
          {icon && <Icon name={icon} />}
          {withCheckbox && (
            <Checkbox checked={isChecked} withRipple={false} onToggle={onToggleCheckbox} />
          )}
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
    return (
      <div ref={containerRef} class="list-item-container">
        <ButtonElement
          class={buildedClass}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...(clickHandlers as any)}
          onContextMenu={handleContextMenu}
          // class={buildedClass}
          // onClick={(e) => stopEvent(e)}
          // onClick={clickHandlers.onMouseDown ? stopEvent : undefined}
          // onMouseDown={}
          href={href}
        >
          {renderContent()}
        </ButtonElement>
        <Menu
          withMount
          className="list-item__context-menu"
          elRef={menuRef}
          isOpen={isContextMenuOpen}
          shouldHandleAwayClick={true}
          onClose={handleContextMenuClose}
          style={styles}
          withPortal={withContextMenuPortal}
        >
          <MenuItem>Lol</MenuItem>
          <MenuItem>Kek</MenuItem>
          <MenuItem>Eshkere</MenuItem>
        </Menu>
      </div>
    )
  }
)
