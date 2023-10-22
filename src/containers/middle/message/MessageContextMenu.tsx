import {type CSSProperties, type FC, type RefObject, memo, useState} from 'preact/compat'

import {type MapState, connect} from 'state/connect'

import ConfirmModalAsync from 'components/popups/ConfirmModal.async'
import {Menu, MenuItem} from 'components/popups/menu'

interface StateProps {}
export interface OwnProps {
  isOpen: boolean // ?
  onClose: VoidFunction
  styles: CSSProperties | undefined
  menuRef: RefObject<HTMLDivElement>
}

const MessageContextMenuImpl: FC<StateProps & OwnProps> = ({
  isOpen,
  onClose,
  styles,
  menuRef,
}) => {
  // const [isMenuOpen, setIsMenuOpen] = useState(true)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleDeleteMessage = () => {
    setIsDeleteModalOpen(true)
    // deleteMessages({ids: [message.id], chatId: message.chatId, deleteForAll: false})
  }
  return (
    <>
      <Menu
        // easing={'cubic-bezier(0.2, 0, 0.2, 1)' as any}
        // timeout={250}
        elRef={menuRef}
        withMount
        withPortal
        className="message-context-menu"
        isOpen={isOpen}
        style={styles}
        onClose={onClose}
      >
        <MenuItem icon="reply">Reply</MenuItem>
        <MenuItem icon="edit">Edit</MenuItem>
        <MenuItem icon="copy">Copy Text</MenuItem>
        <MenuItem icon="forward">Forward</MenuItem>
        <MenuItem icon="select">Select</MenuItem>
        <MenuItem icon="delete" danger onClick={handleDeleteMessage}>
          Delete
        </MenuItem>
      </Menu>
      <ConfirmModalAsync
        action="Delete"
        content={<>Lalalal</>}
        callback={() => {}}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
        }}
      />
    </>
  )
}

const mapStateToProps: MapState<OwnProps, StateProps> = (state, ownProps) => {
  return {}
}

export default memo(connect(mapStateToProps)(MessageContextMenuImpl))
