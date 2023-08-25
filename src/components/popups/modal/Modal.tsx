import {
  type FC,
  type PropsWithChildren,
  type TargetedEvent,
  useCallback,
  useEffect,
  useRef,
} from 'preact/compat'

import {TransitionTest} from 'components/transitions'
import {IconButton} from 'components/ui'
import {Portal} from 'components/ui/Portal'

import {ModalProvider, useModalContext} from '../modal'

import './Modal.scss'

interface ModalProps extends PropsWithChildren {
  isOpen: boolean
  onClose: VoidFunction
  shouldCloseOnBackdrop?: boolean
  hasCloseButton?: boolean
  onExitTransition?: VoidFunction
}

export const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  shouldCloseOnBackdrop,
  hasCloseButton = false,
  children,
  onExitTransition,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add('hasOpenPopup')
    } else {
      document.documentElement.classList.remove('hasOpenPopup')
    }
  }, [isOpen])
  const modalRef = useRef<HTMLDivElement>(null)

  const handleBackdropClick = useCallback(
    (e: TargetedEvent<HTMLDivElement, MouseEvent>) => {
      if (shouldCloseOnBackdrop && !modalRef.current?.contains(e.target as Node)) {
        onClose()
      }
    },
    [shouldCloseOnBackdrop]
  )

  return (
    <ModalProvider value={{isOpen, hasCloseButton, onClose}}>
      <Portal>
        <TransitionTest
          className="Modal"
          appear
          name="fade"
          isMounted={isOpen}
          alwaysMounted={false}
          duration={300}
          onExitTransition={onExitTransition}
          onClick={handleBackdropClick}
        >
          <div class="Modal-paper" ref={modalRef}>
            {children}
          </div>
        </TransitionTest>
      </Portal>
    </ModalProvider>
  )
}

export const ModalTitle: FC = ({children}) => {
  const context = useModalContext()

  return (
    <h5 class="Modal-title">
      {context.hasCloseButton && (
        <IconButton withFastClick onClick={context.onClose} icon="close" />
      )}
      {children}
    </h5>
  )
}

export const ModalActions: FC = ({children}) => {
  return <div class="Modal-actions">{children}</div>
}

export const ModalContent: FC = ({children}) => {
  return <div class="Modal-content">{children}</div>
}
