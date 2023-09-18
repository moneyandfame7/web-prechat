import {type FC, type TargetedEvent, memo, useCallback, useRef} from 'preact/compat'

import clsx from 'clsx'

import {useContextMenu} from 'hooks/useContextMenu'

import type {SignalOr} from 'types/ui'

import {Ripple} from 'components/Ripple'
import {Menu, MenuItem} from 'components/popups/menu'
import type {MenuContextActions} from 'components/ui/ListItem'

interface TabProps {
  contextActions?: MenuContextActions[]
  title: SignalOr<string>
  index: number
  currentIndex: number
  onSelect: (index: number) => void
  badgeCount?: number
  contextLimiterSelector?: string
}
const Tab: FC<TabProps> = memo(
  ({contextActions, title, currentIndex, index, onSelect, contextLimiterSelector}) => {
    const tabRef = useRef<HTMLDivElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)
    const getMenuElement = useCallback(() => {
      return document
        .querySelector('#portal')!
        .querySelector('.tab-context-menu') as HTMLElement | null
    }, [])
    const getLimiterElement = useCallback(() => {
      /**
       * ! але далі робимо перевірку contextLimiterSelector ? ... : ...
       */
      return document.querySelector(contextLimiterSelector!) as HTMLElement | null
    }, [])
    const {handleContextMenu, handleContextMenuClose, isContextMenuOpen, styles} =
      useContextMenu(
        menuRef,
        tabRef,
        getMenuElement,
        contextLimiterSelector ? getLimiterElement : undefined,
        true
      )

    const handleSelectTab = useCallback((e: TargetedEvent<HTMLDivElement, MouseEvent>) => {
      if (e.button !== 0) {
        return
      }
      e.preventDefault()

      onSelect(index)
    }, [])
    return (
      <div
        ref={tabRef}
        onMouseDown={handleSelectTab}
        onContextMenu={handleContextMenu}
        id={`tab-btn-${index}`}
        class={clsx('tab-btn', {
          active: index === currentIndex,
          focused: isContextMenuOpen,
        })}
      >
        {title}
        <Ripple />
        <Menu
          elRef={menuRef}
          withMount
          withPortal
          className="tab-context-menu"
          isOpen={isContextMenuOpen}
          style={styles}
          onClose={handleContextMenuClose}
        >
          <MenuItem icon="edit">Edit folder</MenuItem>
          <MenuItem icon="delete" danger>
            Delete
          </MenuItem>
        </Menu>
      </div>
    )
  }
)

export {Tab}
