import type {FC, TargetedEvent} from 'preact/compat'
import {memo, useCallback, useRef, useState} from 'preact/compat'

import {AuthScreens} from 'types/state'

import {getGlobalState} from 'state/signal'
import {getActions} from 'state/action'
import {t} from 'lib/i18n'

import {InputText, Icon} from 'components/ui'
import {MonkeyTrack} from 'components/monkeys'

import {updateGlobalState} from 'state/persist'

import './AuthCode.scss'

const CODE_LENGTH = 6
const AuthCode: FC = () => {
  const {auth} = getGlobalState()
  const {verifyCode} = getActions()

  const [code, setCode] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChangeCode = async (e: TargetedEvent<HTMLInputElement, Event>) => {
    e.preventDefault()

    const {value} = e.currentTarget
    setCode(value)
    if (auth.error) {
      auth.error = undefined
    }

    if (value.length === 6) {
      // inputRef.current?.blur()  @commented to avoid flick monkey
      verifyCode(value)
    }
  }

  const handleEditPhone = useCallback(() => {
    setCode('')
    updateGlobalState(
      {
        auth: {
          screen: AuthScreens.PhoneNumber
        }
      },
      false
    )
  }, [])

  return (
    <>
      <MonkeyTrack
        inputRef={inputRef}
        size="medium"
        maxLength={CODE_LENGTH}
        currentLength={code.length}
      />
      <h1 class="title">
        {auth.$phoneNumber}
        <Icon
          name="edit"
          color="secondary"
          height={24}
          width={24}
          onClick={handleEditPhone}
        />
      </h1>
      <p class="subtitle">{t('Auth.CodeSendOnPhone')}</p>
      <InputText
        inputMode="decimal"
        type="tel"
        elRef={inputRef}
        autoFocus
        error={auth.error}
        maxLength={CODE_LENGTH}
        label={t('Code')}
        value={code}
        loading={auth.loading}
        onInput={handleChangeCode}
      />
      {/* {auth.loading && <Spinner size="large" />} */}
    </>
  )
}

export default memo(AuthCode)
