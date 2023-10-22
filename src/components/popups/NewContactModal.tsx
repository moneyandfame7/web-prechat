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

import clsx from 'clsx'
import {PhoneNumberInput} from 'modules/auth/PhoneNumberInput'

import type {ApiUser} from 'api/types/users'

import {getActions} from 'state/action'
import {connect} from 'state/connect'
import {getUserStatus} from 'state/helpers/users'
import {selectUser} from 'state/selectors/users'
import {getGlobalState} from 'state/signal'

import {TEST_translate} from 'lib/i18n'

import {getRandomAvatarVariant} from 'utilities/avatar'
import {addKeyboardListeners} from 'utilities/keyboardListener'
import {renderText} from 'utilities/parse/render'
import {extractPhoneCode} from 'utilities/phone/formatPhone'
import {validatePhone} from 'utilities/phone/validatePhone'
import {unformatStr} from 'utilities/string/stringRemoveSpacing'

import {Button, InputText} from 'components/ui'
import {AvatarTest} from 'components/ui/AvatarTest'
import {ListItem} from 'components/ui/ListItem'

import {Modal, ModalActions, ModalContent, ModalHeader, ModalTitle} from './modal/Modal'

import './NewContactModal.scss'

export interface NewContactModalProps {
  isOpen: boolean
  userId?: string
  isByPhoneNumber?: boolean
}
interface StateProps {
  user: ApiUser | undefined
  userStatus: string | undefined
}

const NewContactModal: FC<NewContactModalProps & StateProps> = ({
  isOpen,
  user /*  userId, onClose */,
  userStatus,
}) => {
  const global = getGlobalState()
  const actions = getActions()
  const firstName = useSignal('')
  const lastName = useSignal('')
  const contactPhone = useSignal(extractPhoneCode(global.auth.phoneNumber!) || '')
  // const {value: isLoading, setValue: setLoading} = useBoolean()
  const [isLoading, setIsLoading] = useState(false)

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
      firstName.value = user?.firstName ?? ''
      lastName.value = user?.lastName ?? ''
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

  // const handleEnter = useCallback((e: KeyboardEvent) => {
  //   if (e.key === 'Enter') {
  //     e.preventDefault()
  //     handleSubmit()
  //   }
  //   /* if e.key==='Escape' close */
  // }, [])

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
    return isOpen ? addKeyboardListeners({onEnter: handleSubmit}) : undefined
  }, [])

  const buildedClass = clsx('new-contact-modal', {
    'exist-user': !!user,
  })
  return (
    <Modal
      className={buildedClass}
      onExitTransition={clearForm}
      onClose={handleClose}
      isOpen={isOpen}
      shouldCloseOnBackdrop
      closeOnEsc
    >
      <ModalHeader hasCloseButton>
        <ModalTitle>New Contact</ModalTitle>
      </ModalHeader>
      <ModalContent>
        <form class="form-row">
          <div class="user-info-container">
            {user ? (
              <AvatarTest peer={user} size="xxl" />
            ) : (
              <AvatarTest size="xxl" fullName={fullName} variant={randomAvatarVariant} />
            )}
            {user && (
              <div class="user-info">
                <p class="user-info__phone">
                  {user?.phoneNumber || TEST_translate('NewContact.MobileHidden')}
                </p>
                {/* {user} */}

                <span class="user-info__status">{userStatus}</span>
              </div>
            )}
          </div>
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

        {!user && (
          <PhoneNumberInput
            autoFocus={false}
            elRef={phoneInputRef}
            onInput={handleChangePhone}
            value={contactPhone}
          />
        )}
        <ListItem
          wrap
          icon="phone"
          title={TEST_translate('NewContact.MobileHidden')}
          subtitle={renderText(
            TEST_translate('NewContact.MobileHiddenInfo', {
              fullName: fullName.value,
            }),
            ['markdown']
          )}
        />
        {user && (
          <>
            <ListItem
              className="share-phone-btn"
              withCheckbox
              title={TEST_translate('NewContact.ShareMyPhone')}
            />
            <p class="text-secondary text-center text-small">
              {renderText(
                TEST_translate('NewContact.MakePhoneVisible', {fullName: fullName.value}),
                ['markdown']
              )}
            </p>
          </>
        )}
      </ModalContent>
      <ModalActions>
        <Button onClick={handleSubmit} isDisabled={isDisabledBtn} isLoading={isLoading}>
          Add
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default memo(
  connect<NewContactModalProps, StateProps>((state, ownProps) => {
    const user = ownProps.userId ? selectUser(state, ownProps.userId) : undefined

    return {
      user,
      userStatus: user ? getUserStatus(user) : undefined,
    }
  })(NewContactModal)
)
