import {type FC, memo, useEffect} from 'preact/compat'

import type {ApiChat, ApiUser} from 'api/types'

import {isUserId} from 'state/helpers/users'

import {TEST_translate} from 'lib/i18n'

import {addKeyboardListeners} from 'utilities/keyboardListener'

import type {AnyFunction} from 'types/common'
import type {PreactNode} from 'types/ui'

import {Button} from 'components/ui'
import {AvatarTest} from 'components/ui/AvatarTest'

import {Modal, ModalActions, ModalContent, ModalHeader, ModalTitle} from './modal/Modal'

import './ConfirmModal.scss'

export interface ConfirmModalProps {
  content: PreactNode
  title?: string
  action: string
  isOpen: boolean
  callback: AnyFunction
  onClose: VoidFunction
  chat?: ApiChat
  user?: ApiUser
  // description?:string
}

const ConfirmModal: FC<ConfirmModalProps> = ({
  content,
  action,
  isOpen,
  callback,
  onClose,
  title,
  chat,
  user,
}) => {
  const renderHeaderAvatar = () => {
    if (chat && isUserId(chat.id) && user) {
      return <AvatarTest size="xs" peer={user} />
    }
    if (chat) {
      return <AvatarTest size="xs" peer={chat} />
    }
  }
  const handleActionClick = () => {
    callback()
    onClose()
  }

  useEffect(
    () => (isOpen ? addKeyboardListeners({onEnter: handleActionClick}) : undefined),
    [isOpen]
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnEsc className="ConfirmModal">
      <ModalHeader>
        {renderHeaderAvatar()}
        <ModalTitle>{title || 'Prechat'}</ModalTitle>
      </ModalHeader>
      <ModalContent>{content}</ModalContent>
      <ModalActions>
        <Button fullWidth={false} variant="transparent" onClick={onClose}>
          {TEST_translate('Cancel')}
        </Button>
        <Button
          fullWidth={false}
          color="red"
          variant="transparent"
          onClick={handleActionClick}
        >
          {action}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default memo(ConfirmModal)
