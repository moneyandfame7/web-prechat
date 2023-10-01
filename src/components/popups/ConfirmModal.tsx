import {type FC, memo, useCallback, useEffect} from 'preact/compat'

import {addKeyboardListeners} from 'utilities/keyboardListener'

import type {AnyFunction} from 'types/common'
import type {PreactNode} from 'types/ui'

import {Button} from 'components/ui'

import {Modal, ModalActions, ModalContent, ModalHeader, ModalTitle} from './modal/Modal'

import './ConfirmModal.scss'

export interface ConfirmModalProps {
  content: PreactNode
  title?: string
  action: string
  isOpen: boolean
  callback: AnyFunction
  onClose: VoidFunction
}
/**
 * Maybe rewrite to global state?
 * button onClick action - openConfirm({title:'',action:'',callback:''})
 */
const ConfirmModal: FC<ConfirmModalProps> = ({
  content,
  action,
  isOpen,
  callback,
  onClose,
  title,
}) => {
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
        <ModalTitle>{title || 'Prechat'}</ModalTitle>
      </ModalHeader>
      <ModalContent>{content}</ModalContent>
      <ModalActions>
        <Button fullWidth={false} variant="transparent" onClick={onClose}>
          Close
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
