import {type FC, memo} from 'preact/compat'

import {getActions} from 'state/action'
import {getGlobalState} from 'state/signal'

import {Button} from 'components/ui'

import {Modal} from './modal'
import {ModalActions, ModalContent, ModalHeader, ModalTitle} from './modal/Modal'

export interface CommonModalProps {
  isOpen: boolean
}
const CommonModal: FC<CommonModalProps> = ({isOpen}) => {
  const {closeCommonModal} = getActions()
  const {commonModal} = getGlobalState()
  return (
    <Modal isOpen={isOpen} onClose={closeCommonModal} closeOnEsc>
      <ModalHeader>
        <ModalTitle>{commonModal.title || 'а ДЕ ТАЙТЛ, СУКА?'}</ModalTitle>
      </ModalHeader>
      <ModalContent>{commonModal.body}</ModalContent>
      <ModalActions>
        <Button variant="transparent" fullWidth onClick={closeCommonModal}>
          Ok
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default memo(CommonModal)
