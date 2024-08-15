import type {ComponentChildren} from 'preact'
import type {FC} from 'preact/compat'
import {useErrorBoundary, useLayoutEffect} from 'preact/hooks'

import {useBoolean} from 'hooks/useFlag'

import {MODAL_TRANSITION_MS} from 'common/environment'

import {Modal, ModalActions, ModalContent, ModalHeader, ModalTitle} from './popups/modal/Modal'
import {Button} from './ui'

interface ErrorCatcherProps {
  children: ComponentChildren
}
export const ErrorCatcher: FC<ErrorCatcherProps> = ({children}) => {
  const [error, resetError] = useErrorBoundary()

  const {value, setValue} = useBoolean(!!error)

  useLayoutEffect(() => {
    setValue(!!error)
  }, [error])

  const handleCloseModal = () => {
    setValue(false)
    setTimeout(() => {
      resetError()
    }, MODAL_TRANSITION_MS)
  }
  return (
    <>
      <Modal isOpen={value} onClose={handleCloseModal}>
        <ModalHeader hasCloseButton>
          <ModalTitle>Oops! Something went wrong!</ModalTitle>
        </ModalHeader>
        <ModalContent>{error?.message}</ModalContent>
        <ModalActions>
          <Button variant="transparent" color="primary" onClick={handleCloseModal}>
            Try to reset error
          </Button>
        </ModalActions>
      </Modal>
      {children}
    </>
  )
}
