import {type FC, memo} from 'preact/compat'

import {type ApiChat, ApiUser} from 'api/types'

import {type MapState, connect} from 'state/connect'

import {PreactNode} from 'types/ui'

import {Modal, ModalActions, ModalContent, ModalHeader, ModalTitle} from './modal/Modal'

interface StateProps {
  chat: ApiChat
  user?: ApiUser
}
interface OwnProps {
  chatId: string
  isOpen: boolean
  onClose: VoidFunction
  title: string
  description: string
  handler: VoidFunction
  content?: PreactNode
}
const ChatModalImpl: FC<StateProps & OwnProps> = ({
  isOpen,
  onClose,
  title,
  description,
  content,
  handler,
}) => {
  return (
    <Modal
      closeOnEsc
      // shouldCloseOnBackdrop
      className="crop-photo-modal"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalHeader hasCloseButton>
        <ModalTitle>{title}</ModalTitle>
      </ModalHeader>
      <ModalContent>
        {description}
        {content}
      </ModalContent>
      <ModalActions></ModalActions>
    </Modal>
  )
}

const mapStateToProps: MapState<OwnProps, StateProps> = (state, ownProps) => {
  return {}
}

export default memo(connect(mapStateToProps)(ChatModalImpl))
