import {useComputed, useSignal} from '@preact/signals'
import {
  type FC,
  type TargetedEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'preact/compat'

import {PhoneNumberInput} from 'modules/auth/PhoneNumberInput'

import type {ApiUser} from 'api/types/users'

import {getActions} from 'state/action'

import {getRandomAvatarVariant} from 'utilities/avatar'
import {validatePhone} from 'utilities/phone/validatePhone'
import {unformatStr} from 'utilities/string/stringRemoveSpacing'

import {Button, InputText} from 'components/ui'
import {AvatarTest} from 'components/ui/AvatarTest'
import {useEventListener} from 'hooks/useEventListener'

import {Modal, ModalActions, ModalContent, ModalTitle} from './modal'

import './NewContactModal.scss'

export interface NewContactModalProps {
  isOpen: boolean
  userId?: string
}
/**
 * сам компонент Modal робити не асинхроним, і там буде transition і все таке, а інші модалки - асінхронні
 */
const NewContactModal: FC<NewContactModalProps> = ({isOpen /*  userId, onClose */}) => {
  const actions = getActions()
  const firstName = useSignal('')
  const lastName = useSignal('')
  const contactPhone = useSignal('')
  const userToAdding = {} as ApiUser | undefined

  // eslint-disable-next-line prefer-template
  const fullName = useComputed(() => firstName.value.trim() + ' ' + lastName.value.trim())

  const isDisabledBtn = useComputed(
    () => !firstName.value.length || !validatePhone(unformatStr(contactPhone.value))
  )
  const handleChangePhone = useCallback((value: string) => {
    contactPhone.value = value
  }, [])

  useEffect(() => {
    if (isOpen) {
      firstName.value = userToAdding?.firstName ?? ''
      lastName.value = userToAdding?.lastName ?? ''
    }
  }, [isOpen])

  const handleChangeFirstName = useCallback((e: TargetedEvent<HTMLInputElement, Event>) => {
    firstName.value = e.currentTarget.value
  }, [])

  const handleChangeLastName = useCallback((e: TargetedEvent<HTMLInputElement, Event>) => {
    lastName.value = e.currentTarget.value
  }, [])

  const handleClose = useCallback(() => {
    actions.closeAddContactModal()
  }, [])

  const handleEnter = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }, [])
  const clearForm = useCallback(() => {
    firstName.value = ''
    lastName.value = ''
    contactPhone.value = ''
  }, [])
  const handleSubmit = useCallback(() => {
    actions.addContact({
      firstName: firstName.value,
      lastName: lastName.value,
      phone: contactPhone.value,
    })
  }, [])

  const randomAvatarVariant = useMemo(() => getRandomAvatarVariant(), [])

  const render = useRef(0)
  render.current += 1
  const phoneInputRef = useRef<HTMLInputElement>(null)
  useEventListener('keydown', handleEnter)
  return (
    <Modal
      onExitTransition={clearForm}
      hasCloseButton
      onClose={handleClose}
      isOpen={isOpen}
      shouldCloseOnBackdrop
    >
      <ModalTitle>New Contact {render.current}</ModalTitle>
      <ModalContent>
        <form class="form-row">
          <AvatarTest size="xl" fullName={fullName} variant={randomAvatarVariant} />
          <div class="form-fields">
            <InputText
              autoFocus
              label="First name (required)"
              onInput={handleChangeFirstName}
              value={firstName}
            />
            <InputText
              label="Last name (optional)"
              onInput={handleChangeLastName}
              value={lastName}
            />
          </div>
        </form>

        <PhoneNumberInput
          autoFocus={false}
          elRef={phoneInputRef}
          onInput={handleChangePhone}
          value={contactPhone}
        />
      </ModalContent>
      <ModalActions>
        <Button onClick={handleSubmit} isDisabled={isDisabledBtn}>
          Add
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default memo(NewContactModal)
