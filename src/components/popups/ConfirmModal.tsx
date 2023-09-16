import {type FC, memo, useCallback} from 'preact/compat'

import type {AnyFunction} from 'types/common'

import {Button} from 'components/ui'

import {Modal, ModalActions, ModalContent, ModalHeader, ModalTitle} from './modal/Modal'

import './ConfirmModal.scss'

export interface ConfirmModalProps {
  title: string
  action: string
  isOpen: boolean
  callback: AnyFunction
  onClose: VoidFunction
}
/**
 * Maybe rewrite to global state?
 * button onClick action - openConfirm({title:'',action:'',callback:''})
 */
const ConfirmModal: FC<ConfirmModalProps> = ({title, action, isOpen, callback, onClose}) => {
  const handleActionClick = useCallback(() => {
    callback()
    onClose()
  }, [callback, onClose])
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnEsc className="ConfirmModal">
      <ModalHeader>
        <ModalTitle>Prechat</ModalTitle>
      </ModalHeader>
      <ModalContent>{title}</ModalContent>
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
