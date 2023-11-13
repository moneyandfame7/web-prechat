import {useComputed, useSignal} from '@preact/signals'
import {
  type FC,
  type PropsWithChildren,
  type TargetedEvent,
  useCallback,
  useEffect,
  useRef,
} from 'preact/compat'

import {useBoolean} from 'hooks/useFlag'

import {addEscapeListener} from 'utilities/keyboardListener'

import EmojiPicker from 'components/common/emoji-picker/EmojiPicker.async'
import {SingleTransition} from 'components/transitions'
import {Button, IconButton} from 'components/ui'
import {Portal} from 'components/ui/Portal'
import {TextArea, type TextAreaProps} from 'components/ui/TextArea'

import {ModalProvider, useModalContext} from './context'

import './Modal.scss'

interface ModalProps extends PropsWithChildren {
  isOpen: boolean
  onClose: VoidFunction
  shouldCloseOnBackdrop?: boolean
  hasCloseButton?: boolean
  onExitTransition?: VoidFunction
  className?: string
  closeOnEsc?: boolean
}

export const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  shouldCloseOnBackdrop,
  hasCloseButton = false,
  children,
  onExitTransition,
  className,
  closeOnEsc,
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

  useEffect(() => {
    return isOpen && closeOnEsc
      ? addEscapeListener(() => {
          onClose()
        })
      : undefined
  }, [isOpen, closeOnEsc])
  const buildedClass = ['Modal-paper', className].filter(Boolean).join(' ')
  return (
    <ModalProvider value={{isOpen, hasCloseButton, onClose}}>
      <Portal>
        <SingleTransition
          className="Modal"
          appear
          name="fade"
          in={isOpen}
          unmount={true}
          timeout={200}
          onExited={onExitTransition}
          onClick={handleBackdropClick}
        >
          <div class={buildedClass} ref={modalRef}>
            {children}
          </div>
        </SingleTransition>
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
  return <div class="Modal-content scrollable scrollable-y">{children}</div>
}

export const ModalFooter: FC = ({children}) => {
  return <div class="Modal-footer">{children}</div>
}

interface ModalInputProps extends TextAreaProps {
  onSubmit: VoidFunction
}
export const ModalInput: FC<ModalInputProps> = (props) => {
  const isScrolledSignal = useSignal(false)
  useEffect(() => {
    const scroll = props.inputRef.current

    if (!scroll) {
      return
    }
    const handleScroll = () => {
      isScrolledSignal.value = scroll.scrollTop > 0
    }

    scroll?.addEventListener('scroll', handleScroll)

    return () => scroll?.removeEventListener('scroll', handleScroll)
  }, [])

  const computedClass = useComputed(
    () => `modal-input-container${isScrolledSignal.value ? ' scrolled' : ''}`
  )

  return (
    <div class={computedClass}>
      <IconButton icon="smile" />
      <TextArea {...props} />
      <Button onClick={props.onSubmit}>Send</Button>
    </div>
  )
}
interface ModalHeaderProps {
  hasCloseButton?: boolean
}
export const ModalHeader: FC<ModalHeaderProps> = ({children, hasCloseButton = false}) => {
  const context = useModalContext()

  return (
    <div class="Modal-header">
      {hasCloseButton && <IconButton withFastClick onClick={context.onClose} icon="close" />}
      {children}
    </div>
  )
}
