import {type FC, useRef} from 'preact/compat'

import clsx from 'clsx'

import {useContextMenu} from 'hooks/useContextMenu'
import {useBoolean} from 'hooks/useFlag'

import {Menu, MenuItem} from 'components/popups/menu'
import {Icon} from 'components/ui'

const getMenuElement = () =>
  document.querySelector('#portal')!.querySelector('.story-context-menu') as HTMLElement | null
const StoryItem: FC = () => {
  const menuRef = useRef<HTMLDivElement>(null)
  const storyRef = useRef<HTMLDivElement>(null)
  const {handleContextMenu, handleContextMenuClose, isContextMenuOpen, styles} =
    useContextMenu(menuRef, storyRef, getMenuElement)

  const {value, toggle} = useBoolean()

  const buildedClass = clsx('story-item', {
    'is-viewed': false,
    'is-loading': value,
  })
  return (
    <div
      onClick={toggle}
      ref={storyRef}
      class={buildedClass}
      onContextMenu={handleContextMenu}
    >
      <div class="stories-avatar-inner">
        <div class="stories-avatar-inner-inner">LR</div>
      </div>
      <span class="stories-add-story-badge">
        <Icon name="plus" />
      </span>
      <Menu
        elRef={menuRef}
        withMount
        withPortal
        className="story-context-menu"
        isOpen={isContextMenuOpen}
        style={styles}
        onClose={handleContextMenuClose}
      >
        <MenuItem icon="channel">Open channel</MenuItem>
        <MenuItem icon="archive2">Hide story</MenuItem>
      </Menu>
    </div>
  )
}

export {StoryItem}
