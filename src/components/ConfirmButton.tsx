import {type VNode} from 'preact'
import {type FC, cloneElement, useCallback} from 'preact/compat'

import {useBoolean} from 'hooks/useFlag'

import ConfirmModal from './popups/ConfirmModal.async'
import type {ButtonProps} from './ui'
import type {IconButtonProps} from './ui/IconButton'

interface ConfirmButtonProps {
  children: VNode<ButtonProps> | VNode<IconButtonProps>
  title: string
  action: string
  callback: VoidFunction
  onCancel?: VoidFunction
}
export const ConfirmButton: FC<ConfirmButtonProps> = ({
  children,
  title,
  action,
  callback,
  onCancel,
}) => {
  const {value: isModalOpen, setTrue: openModal, setFalse: closeModal} = useBoolean()
  const test = cloneElement(children, {
    onClick: () => {
      openModal()
    },
  })

  const handleOnCancel = useCallback(() => {
    onCancel?.()
    closeModal()
  }, [onCancel])

  return (
    <>
      {test}

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={handleOnCancel}
        title={title}
        action={action}
        callback={callback}
      />
    </>
  )
}
