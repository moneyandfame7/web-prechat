import {
  type FC,
  memo,
  useRef,
  type TargetedEvent,
  useEffect,
  useCallback,
  useMemo
} from 'preact/compat'
import {useComputed, useSignal} from '@preact/signals'

import {Button, InputText} from 'components/ui'

import {validatePhone} from 'utilities/phone'

import {getActions} from 'state/action'

import {PhoneNumberInput} from 'modules/auth/PhoneNumberInput'

import {unformatStr} from 'utilities/stringRemoveSpacing'
import {getRandomAvatarVariant} from 'utilities/avatar'
import {useEventListener} from 'hooks/useEventListener'

import {Modal, ModalActions, ModalContent, ModalTitle} from './modal'

import './NewContactModal.scss'
import {AvatarTest} from 'components/ui/AvatarTest'
import type {ApiUser} from 'api/types/users'

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

  const handleChangeFirstName = useCallback(
    (e: TargetedEvent<HTMLInputElement, Event>) => {
      firstName.value = e.currentTarget.value
    },
    []
  )

  const handleChangeLastName = useCallback(
    (e: TargetedEvent<HTMLInputElement, Event>) => {
      lastName.value = e.currentTarget.value
    },
    []
  )

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
      phone: contactPhone.value
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
          <AvatarTest size="xl" fullName={fullName.value} variant={randomAvatarVariant} />
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
    // <Portal>
    //   <TransitionTest
    //     className="Modal NewContactModal"
    //     appear
    //     name="fade"
    //     isMounted={isOpen}
    //     alwaysMounted={false}
    //     duration={300}
    //     // onClick={handleClose}
    //   >
    //     {/* <div class="Modal NewContactModal"> */}
    //     <div class="Modal-content" ref={modalRef}>
    //       <div class="Modal-header">
    //         {render.current}
    //         {userId}
    //         <IconButton withFastClick onClick={handleClose} icon="close" />
    //         <h5 class="title">New contact</h5>
    //         <Button isDisabled={isDisabledBtn}>Add</Button>
    //       </div>

    //       <div class="Modal-body">
    //
    //       </div>

    //       <div class="Modal-footer">{}</div>
    //     </div>
    //     {/* </div> */}
    //   </TransitionTest>
    // </Portal>
  )
}

export default memo(NewContactModal)
