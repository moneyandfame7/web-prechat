import { FC, TargetedEvent, memo, useCallback, useMemo } from 'preact/compat'
import { useSignal } from '@preact/signals'

import { AuthScreens } from 'types/state'

import { getGlobalState } from 'state/signal'
import { getActions } from 'state/action'
import { t } from 'lib/i18n'

import { InputText } from 'components/Input'
import { Spinner } from 'components/Spinner'
import { Button } from 'components/Button'

import './AuthCode.scss'

const AuthCode: FC = () => {
  const { auth } = getGlobalState()
  const { verifyCode, changeAuthScreen } = getActions()
  // const emojiRef = useRef<HTMLHeadingElement>(null)

  const handleChangeCode = async (e: TargetedEvent<HTMLInputElement, Event>) => {
    e.preventDefault()

    const { value } = e.currentTarget
    code.value = value
    if (auth.error) {
      auth.error = undefined
    }

    // if (value.length === 0) {
    //   emojiRef.current?.classList.add('animated')
    // } else if (emojiRef?.current?.style) {
    // emojiRef.current?.classList.remove('animated')

    // value.length % 2 === 0
    //   ? (emojiRef.current.style.transform = `rotate(${value.length * -3}deg)`)
    //   : (emojiRef.current.style.transform = `rotate(${value.length * 3}deg)`)
    // }
    if (value.length === 6) {
      verifyCode(value)
    }
  }

  const handleEditPhone = useCallback(() => {
    changeAuthScreen(AuthScreens.PhoneNumber)
  }, [])
  const code = useSignal('')
  const authSubtitle = useMemo(
    () => (auth.hasActiveSessions ? t('Auth.CodeSendOnApp') : t('Auth.CodeSendOnPhone')),
    [auth.hasActiveSessions]
  )
  return (
    <>
      {auth.loading && <Spinner size="large" color="primary" />}
      {/* // ) : (
      //   <h1 class="emoji animated" ref={emojiRef}>
      //     ✉️
      //   </h1>
      // )} */}
      <h1 class="title">
        {auth.$phoneNumber}
        <i onClick={handleEditPhone} class="fa-solid fa-pencil" />
      </h1>
      <p class="subtitle">{authSubtitle}</p>
      <InputText
        error={auth.error}
        maxLength={6}
        label={t('Code').value}
        value={code.value}
        onInput={handleChangeCode}
      />
      <Button
        onClick={() => {
          changeAuthScreen(AuthScreens.Password)
        }}
      >
        A?
      </Button>
      <Button
        onClick={() => {
          changeAuthScreen(AuthScreens.SignUp)
        }}
      >
        BBBBBB
      </Button>
    </>
  )
}

export default memo(AuthCode)
