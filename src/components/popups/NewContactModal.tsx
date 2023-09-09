import {useComputed, useSignal} from '@preact/signals'
import {
  type FC,
  type TargetedEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/compat'

import {PhoneNumberInput} from 'modules/auth/PhoneNumberInput'

import type {ApiUser} from 'api/types/users'

import {getActions} from 'state/action'

import {useEventListener} from 'hooks/useEventListener'
import {useBoolean} from 'hooks/useFlag'

import {getRandomAvatarVariant} from 'utilities/avatar'
import {addEscapeListener} from 'utilities/keyboardListener'
import {validatePhone} from 'utilities/phone/validatePhone'
import {unformatStr} from 'utilities/string/stringRemoveSpacing'

import {Button, InputText} from 'components/ui'
import {AvatarTest} from 'components/ui/AvatarTest'

import {Modal, ModalActions, ModalContent, ModalTitle} from './modal'
import {ModalHeader} from './modal/Modal'

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
  // const {value: isLoading, setValue: setLoading} = useBoolean()
  const [isLoading, setIsLoading] = useState(false)
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
    /* if e.key==='Escape' close */
  }, [])

  const clearForm = useCallback(() => {
    firstName.value = ''
    lastName.value = ''
    contactPhone.value = ''
  }, [])
  const handleSubmit = useCallback(async () => {
    setIsLoading(true)
    await actions.addContact({
      firstName: firstName.value,
      lastName: lastName.value,
      phone: contactPhone.value,
    })
    setIsLoading(false)
  }, [])

  const randomAvatarVariant = useMemo(() => getRandomAvatarVariant(), [])

  const render = useRef(0)
  render.current += 1
  const phoneInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return isOpen ? addEscapeListener(handleSubmit) : undefined
  }, [])
  return (
    <Modal
      onExitTransition={clearForm}
      onClose={handleClose}
      isOpen={isOpen}
      shouldCloseOnBackdrop
    >
      <ModalHeader hasCloseButton>
        <ModalTitle>New Contact</ModalTitle>
      </ModalHeader>
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
        <Button onClick={handleSubmit} isDisabled={isDisabledBtn} isLoading={isLoading}>
          Add
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default memo(NewContactModal)
